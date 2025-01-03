from uuid import UUID

from rest_framework.serializers import (
    ModelSerializer,
    SerializerMethodField,
    HyperlinkedIdentityField,
)

from .models import CustomUser


class CustomUserSerializer(ModelSerializer):
    id = SerializerMethodField(read_only=True)
    see_more = HyperlinkedIdentityField(view_name='profile', lookup_field='id')

    class Meta:
        model = CustomUser
        fields = ["id", "username", "password", "email", "first_name", "last_name", 'see_more', ]
        extra_kwargs = {'password': {'write_only': True}}

    def get_id(self, obj: CustomUser) -> UUID | None:
        if not hasattr(obj, 'id') or not isinstance(obj, self.Meta.model):
            return None

        return obj.id

    def create(self, validated_data):
        user = CustomUser(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
        )

        user.set_password(validated_data['password'])
        user.save()
        return user

    def update(self, instance: CustomUser, validated_data):
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)

        password = validated_data.get('password')
        if password:
            instance.set_password(password)

        instance.save()
        return instance
