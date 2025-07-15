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
            course_code=course_code,
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


@api_view(["POST"])
def save_students_answers(request):
    students_data = request.data.get("students")
    course_code = request.data.get("course_code")

    if not students_data:
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
    except IntegrityError as e:
        print(e)
        return Response({"message": "Email address already taken."}, status=403)

    login(request, user)
    return Response({"user": user.email}, status=201)
