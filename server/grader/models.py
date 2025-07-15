from decimal import Decimal

from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.username} (User ID: {self.id})"


class AnswerKey(models.Model):
    GRADING_SCALE_CHOICES = [
        ("STD", "Standard"),
        ("NUM", "Numeric"),
        ("CUS", "Custom"),
    ]

    author = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="answer_keys"
    )
    course_code = models.CharField(max_length=10)
    course_name = models.CharField(max_length=50)
    no_of_questions = models.IntegerField(default=20)

    grading_scale = models.CharField(
        max_length=20,
        choices=GRADING_SCALE_CHOICES,
        default="STD",
    )
    keys = models.TextField("Answer keys")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    mark_per_question = models.IntegerField()
    total_marks = models.IntegerField()

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["author", "course_code"], name="unique_author_course"
            ),
            models.CheckConstraint(
                check=models.Q(grading_scale__in=["STD", "NUM", "CUS"]),
                name="grading_scale_valid",
            ),
        ]

    def __str__(self):
        return f"{self.course_code} - {self.course_name} | {self.no_of_questions} Qs | by {self.author.username}"


class Setting(models.Model):
    answer_key = models.OneToOneField(
        AnswerKey, on_delete=models.CASCADE, related_name="setting"
    )
    negative_marking = models.BooleanField(default=False)
    points_deducted = models.DecimalField(
        "Points deducted per mistake",
        decimal_places=2,
        max_digits=5,
        default=Decimal("0.25"),
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        neg_mark = "Enabled" if self.negative_marking else "Disabled"
        return (
            f"Settings for {self.answer_key.course_code}: Negative Marking - {neg_mark}, "
            f"Deduction: {self.points_deducted}"
        )


class Submission(models.Model):
    student_id = models.IntegerField(null=False, blank=False)
    student_name = models.TextField(null=True, blank=True)
    associated_with = models.ForeignKey(
        AnswerKey, on_delete=models.CASCADE, related_name="submissions"
    )
    answers = models.TextField("Answer keys")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    score = models.FloatField(default=0)
    percentage = models.FloatField(default=0.0)
    grade = models.CharField(null=True, blank=True)

    def __str__(self):
        return (
            f"{self.student_name or self.student_id} | {self.associated_with.course_code} | "
            f"Score: {self.score} ({self.percentage}%) Grade: {self.grade}"
        )
