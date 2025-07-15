from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import AnswerKey, Setting, Submission, User


# Create your views here.
@api_view(["POST"])
def save_answer_key(request):
    data = request.data

    if not data:
        return Response({"error": "Missing cleanAnswerKey"}, status=400)

    answer_key = data["answerKey"]
    course_code = data["courseCode"]
    course_name = data["courseName"]
    num_of_questions = data["numQuestions"]
    mark_per_question = data["markPerQuestion"]
    negative_marking = data["negativeMarking"]
    negative_points = data["negativePoints"]
    total_marks = data["totalMarks"]
    grading_scale = data["gradingScale"]
    author = data["author"]

    if any(
        v in [None, ""]
        for v in [
            answer_key,
            course_code,
            course_name,
            num_of_questions,
            mark_per_question,
            total_marks,
            negative_points,
            grading_scale,
            author,
        ]
    ):
        if negative_marking is None:
            return Response({"error": "Missing required values"}, status=400)

        return Response({"error": "Missing required values"}, status=400)

    try:
        user = User.objects.get(username=author)
    except User.DoesNotExist:
        return Response({"message": "Unauthorized"}, status=401)

    # If answer key already exists
    if AnswerKey.objects.filter(author=user, course_code=course_code):
        return Response(
            {"message": f"Answer key for {course_code} already exists"}, status=400
        )
    else:
        # Insert answer key
        a = AnswerKey(
            author=user,
            course_code=course_code.upper(),
            no_of_questions=num_of_questions,
            grading_scale=grading_scale,
            keys=answer_key,
            total_marks=total_marks,
            mark_per_question=mark_per_question,
            course_name=course_name,
        )
        a.save()

        # Insert settings
        get_answer_key = AnswerKey.objects.get(author=user, course_code=course_code)  # type: ignore
        if get_answer_key:
            s = Setting(
                answer_key=get_answer_key,
                negative_marking=negative_marking,
                points_deducted=negative_points,
            )
            s.save()

            return Response({"message": "Saved successfully"}, status=201)


def get_grade(score):
    if score >= 90:
        return "A"
    elif score >= 80:
        return "B"
    elif score >= 70:
        return "C"
    elif score >= 60:
        return "D"
    elif score >= 50:
        return "E"
    else:
        return "F"


@api_view(["GET"])
def fetch_course_submissions(request, course_code):
    course_code = course_code.upper()
    author = request.query_params.get("id")
    submissions = Submission.objects.filter(
        associated_with__author__username=author,
        associated_with__course_code=course_code,
    )
    total_score = 0

    scores = []

    course = AnswerKey.objects.get(author__username=author, course_code=course_code)  # type: ignore
    no_of_questions = course.no_of_questions

    course_percentage_sum = 0
    pass_count = 0

    all_submissions = []

    student_answers = []
    correct_answers = []
    for key in course.keys:
        correct_answers.append(key)

    for submission in submissions:
        j = 0
        student_answers = []
        while j < len(correct_answers):
            student_answers.append(submission.answers[j])
            j += 1

        all_submissions.append(
            {
                "id": submission.id,  # type: ignore
                "studentId": submission.student_id,
                "studentName": submission.student_name,
                "score": submission.score,
                "percentage": submission.percentage,
                "timeProcessed": submission.updated_at.strftime("%d/%m/%Y"),
                "grade": submission.grade,
                "answers": student_answers,
            }
        )
        scores.append(submission.score)
        total_score += submission.score

        percent_score = (submission.score / no_of_questions) * 100
        course_percentage_sum += percent_score

        if submission.grade in ["A", "B", "C", "D", "E"]:
            pass_count += 1

    passRate = (pass_count / len(submissions)) * 100 if len(submissions) else 0
    course_avg = course_percentage_sum / len(submissions)

    return Response(
        {
            "courseName": course.course_name,
            "courseCode": course.course_code,
            "totalSubmissions": len(submissions.all()),
            "averageScore": f"{course_avg:.2f}",
            "highestScore": max(scores),
            "passRate": passRate,
            "submissions": all_submissions,
            "numOfQuestions": no_of_questions,
            "correctAnswers": correct_answers,
        },
        status=200,
    )


@api_view(["GET"])
def fetch_all_submissions(request):
    author = request.query_params.get("id")

    # Get all submissions and courses for this author
    total_submissions = Submission.objects.filter(
        associated_with__author__username=author
    ).all()

    courses = AnswerKey.objects.filter(author__username=author).all()

    total_percentages = 0
    total_submissions_count = 0
    course_list = []

    for course in courses:
        submissions = Submission.objects.filter(associated_with_id=course.id).all()  # type: ignore

        if not submissions:
            continue  # Skip if no submissions

        last_submission = submissions.order_by("-updated_at").first()
        last_activity = (
            last_submission.updated_at.strftime("%d/%m/%Y")
            if last_submission
            else "N/A"
        )

        max_score = course.no_of_questions

        course_percentage_sum = 0

        for submission in submissions:
            percent_score = (submission.score / max_score) * 100
            course_percentage_sum += percent_score

        course_avg = course_percentage_sum / len(submissions)

        course_list.append(
            {
                "id": course.id,  # type: ignore
                "courseCode": course.course_code,
                "courseName": course.course_name,
                "totalSubmissions": len(submissions),
                "lastActivity": last_activity,
                "averageScore": f"{course_avg:.2f}",
            }
        )

        total_percentages += course_percentage_sum
        total_submissions_count += len(submissions)

    if total_submissions_count > 0:
        overall_avg = total_percentages / total_submissions_count
    else:
        overall_avg = 0.0

    return Response(
        {
            "totalSubmissions": len(total_submissions),
            "totalCourses": len(courses),
            "overallAverage": f"{overall_avg:.2f}",
            "courseList": course_list,
        },
        status=200,
    )


@api_view(["POST"])
def save_students_answers(request):
    students_data = request.data.get("students")
    course_code = request.data.get("course_code")

    if not students_data or not course_code:
        return Response({"error": "Missing cleanAnswerKey"}, status=400)

    try:
        a = AnswerKey.objects.get(course_code=course_code)
        s = Setting.objects.get(answer_key=a)
    except (AnswerKey.DoesNotExist, Setting.DoesNotExist):
        pass
    else:
        for student in students_data:
            student_answers = student["answers"]
            correct_answers = a.keys

            j = 0
            score = 0
            while j < len(correct_answers):
                # If correct
                if student_answers[j].upper() == correct_answers[j].upper():
                    score = score + 1
                else:
                    # If negative marking is True: Deduct score
                    if s.negative_marking:
                        if score > s.points_deducted:
                            score = score - s.points_deducted
                    else:
                        pass

                j = j + 1

            if a.no_of_questions == 0:
                percentage = 0
                grade = get_grade(percentage)
            else:
                percentage = round((score / a.no_of_questions) * 100, 2)
                grade = get_grade(percentage)

            student_id = student["studentId"]
            student_name = student["studentName"]

            # Save to submissions
            # todo: Check if user exists then update answer key
            su = Submission(
                student_id=student_id,
                student_name=student_name,
                associated_with=a,
                answers=student_answers,
                score=score,
                percentage=percentage,
                grade=grade,
            )
            su.save()

        return Response({"message": "Saved successfully"}, status=201)


@api_view(["GET"])
def keys(_, email):
    user = User.objects.get(username=email)
    keys = AnswerKey.objects.filter(author=user)

    answer_keys = []
    for key in keys:
        s = Setting.objects.filter(answer_key=key).last()

        answer_keys.append(
            {
                "id": key.id,  # type: ignore
                "courseCode": key.course_code,
                "numQuestions": key.no_of_questions,
                "courseName": key.course_name,
                "gradingScale": key.grading_scale,
                "answerKey": key.keys,
                "dateAdded": key.created_at,
                "updatedAt": key.updated_at,
                "negativeMarking": s.negative_marking,  # type: ignore
                "totalMarks": key.total_marks,
                "markPerQuestion": key.mark_per_question,
            }
        )
    return Response(answer_keys, status=200)


@api_view(["PATCH"])
def edit_answer_key(request):
    data = request.data

    if not data:
        return Response({"error": "Missing cleanAnswerKey"}, status=400)

    id = data["id"]
    answer_key = data["answerKey"]
    course_code = data["courseCode"]
    course_name = data["courseName"]
    num_of_questions = data["numQuestions"]
    negative_marking = data["negativeMarking"]
    grading_scale = data["gradingScale"]
    total_marks = data["totalMarks"]
    author = data["author"]

    if any(
        v in [None, ""]
        for v in [
            answer_key,
            course_code,
            course_name,
            num_of_questions,
            grading_scale,
            author,
        ]
    ):
        if negative_marking is None:
            return Response({"error": "Missing required values"}, status=400)

        return Response({"error": "Missing required values"}, status=400)

    try:
        author_obj = User.objects.get(username=author)
    except User.DoesNotExist:
        return Response({"message": "Unauthorized request"}, status=400)
    else:
        a = AnswerKey.objects.filter(id=id, author=author_obj)

        # Update answer key
        a.update(
            course_code=course_code,
            course_name=course_name,
            no_of_questions=num_of_questions,
            keys=answer_key,
            total_marks=total_marks,
        )

        # Update setting for answer key
        s = Setting.objects.filter(answer_key=a.last())
        s.update(negative_marking=negative_marking)

        return Response({"message": "Answer Key Updated"}, status=200)


@api_view(["POST"])
def delete_answer_key(request):
    data = request.data
    id = data.get("id")
    author = data.get("author")

    if author is None:
        return Response({"error": "Unauthorized Access"}, status=401)

    try:
        author_obj = User.objects.get(username=author)
    except User.DoesNotExist:
        return Response({"message": "Unauthorized request"}, status=400)
    else:
        a = AnswerKey.objects.filter(id=id, author=author_obj)
        a.delete()

        return Response({"message": "Answer Key Deleted"}, status=200)


@api_view(["POST"])
def login_view(request):
    # Attempt to sign user in
    email = request.data.get("email")
    password = request.data.get("password")
    user = authenticate(request, username=email, password=password)

    # Check if authentication successful
    if user is not None:
        login(request, user)
        return Response({"user": user.email}, status=201)
    else:
        return Response({"message": "Invalid credentials"}, status=403)


def logout_view(request):
    logout(request)


@api_view(["POST"])
def register(request):
    email = request.data.get("email")

    # Ensure password matches confirmation
    password = request.data.get("password")
    confirmation = request.data.get("confirmPassword")
    if password != confirmation:
        return Response({"message": "Passwords must match."}, status=403)

    # Attempt to create new user
    try:
        user = User.objects.create_user(email, email, password)
        user.save()
    except IntegrityError:
        return Response({"message": "Email address already taken."}, status=403)

    login(request, user)
    return Response({"user": user.email}, status=201)
