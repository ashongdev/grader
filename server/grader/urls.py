from django.urls import path

from grader import views

urlpatterns = [
    path("save", views.save_answer_key, name="saveAnswerKey"),
    path("courses", views.fetch_all_submissions, name="courses"),
    path(
        "course/<str:course_code>",
        views.fetch_course_submissions,
        name="course_submissions",
    ),
    path("save-answers", views.save_students_answers, name="saveStudentsAnswers"),
    path("login", views.login_view, name="login"),
    path("register", views.register, name="register"),
    path("keys/<str:email>", views.keys, name="keys"),
    path("edit", views.edit_answer_key, name="edit"),
    path("delete", views.delete_answer_key, name="delete"),
]
