from django.urls import path

from grader import views

urlpatterns = [
    path("save", views.save_answer_key, name="saveAnswerKey"),
    path("login", views.login_view, name="login"),
    path("register", views.register, name="register"),
    path("keys/<str:email>", views.keys, name="keys"),
    path("edit", views.edit_answer_key, name="edit"),
    path("delete", views.delete_answer_key, name="delete"),
]
