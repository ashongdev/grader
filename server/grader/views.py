from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import AnswerKey, Setting, User


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
        # if negative_marking is None:
        #     print("negative_marking is missing!")

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


@api_view(["GET"])
def keys(request, email):
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
                "grading_scale": key.grading_scale,
                "answerKey": key.keys,
                "dateAdded": key.created_at,
                "updated_at": key.updated_at,
                "negativeMarking": s.negative_marking,  # type: ignore
                "totalMarks": key.total_marks,
            }
        )
    return Response(answer_keys, status=200)


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
    print(request.data)
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
