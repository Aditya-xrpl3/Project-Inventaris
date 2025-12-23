from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.models import User


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True, min_length=6)

    def validate(self, data):
        user = authenticate(
            username=data["username"],
            password=data["password"]
        )
        if not user:
            raise serializers.ValidationError("Username atau password salah")

        data["user"] = user
        return data


class RegisterSerializer(serializers.ModelSerializer):
    name = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ["username", "password", "name"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        name = validated_data.pop("name", "")
        user = User.objects.create_user(**validated_data)
        if name:
            user.first_name = name
            user.save()
        return user
