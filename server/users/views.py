from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserRegistrationSerializer, UserSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
class UserRegistrationView(APIView):
    """
    Vue pour enregistrer un utilisateur standard.
    """
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Utilisateur créé avec succès."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        # Vérifier que l'utilisateur existe et que le mot de passe est correct
        user = User.objects.filter(email=email).first()

        if user and user.check_password(password):
            # Créer un refresh token et un access token
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            # Sérialiser les données de l'utilisateur
            user_data = UserSerializer(user).data

            # Renvoyer les tokens et les données utilisateur dans la réponse
            return Response({
                'access': access_token,
                'refresh': str(refresh),
                'user': user_data  # Données utilisateur ici
            })
        
        return Response({'detail': 'Invalid credentials'}, status=400)
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.data.get("refresh_token")
            if not refresh_token:
                return Response({"error": "Refresh token is required."}, status=status.HTTP_400_BAD_REQUEST)
            
            token = RefreshToken(refresh_token)
            token.blacklist()  # Blacklist the refresh token
            
            return Response({"message": "Successfully logged out."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)