"""
JWT authorization views which permits to request/post
data through the API only if user is logged in
GenerateJWToken- generates when 
 and JWT required decorator
"""

# import jwt
# from django.conf import settings
# from functools import wraps
# from django.http import JsonResponse
# import datetime

# JWT_SECRET = getattr(settings, 'JWT_SECRET', 'your_default_secret')
# JWT_ALGORITHM = getattr(settings, 'JWT_ALGORITHM', 'HS256')
# JWT_EXP_DELTA_SECONDS = getattr(settings, 'JWT_EXP_DELTA_SECONDS', 3600)

# def generate_jwt_token(user):
#     payload = {
#         'user_id': user.id,
#         'email': user.email,
#         'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=JWT_EXP_DELTA_SECONDS)
#     }
#     token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
#     return token

# def jwt_required(view_func):
#     @wraps(view_func)
#     def _wrapped_view(request, *args, **kwargs):
#         token = request.COOKIES.get('jwt')
#         if not token:
#             return JsonResponse({'code': 401, 'message': 'Authentication credentials were not provided.'}, status=401)
#         try:
#             payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
#             request.user_id = payload['user_id']
#             request.user_email = payload['email']
#         except jwt.ExpiredSignatureError:
#             return JsonResponse({'code': 401, 'message': 'Token has expired.'}, status=401)
#         except jwt.InvalidTokenError:
#             return JsonResponse({'code': 401, 'message': 'Invalid token.'}, status=401)
#         return view_func(request, *args, **kwargs)
#     return _wrapped_view
