from django.http import JsonResponse
from django.utils import timezone
from .models import Auth,Info
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def test(request):    
    return JsonResponse({'message': list(Auth.objects.values()),'message2':list(Info.objects.values())})
@csrf_exempt
def signup(request):
     if request.method == 'POST':

        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        fname = data.get('fname')
        lname = data.get('lname')
        country = data.get('country')
        city = data.get('city')
        phone_number = data.get('phone', '').replace('+','').replace('-','')
        phone = int(phone_number)

        address = data.get('address')
        pin=data.get('pin')
        date_joined=timezone.now()

        try:
            Auth.objects.create(email=email, password=password,date_joined=date_joined)
            Info.objects.create(email=email, fname=fname, lname=lname, country=country, city=city, phone=phone, address=address,pin=pin,date_joined=date_joined)
            return JsonResponse({'message': 'User created successfully'},status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)},status=500) 
        
     else:
            return JsonResponse({'error': 'Invalid request method'}, status=400)


@csrf_exempt
def login(request):    
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        try:
            user = Auth.objects.get(email=email)
            if user.password == password:
                return JsonResponse({'message': 'Login Success'}, status =200)
            else:
                return JsonResponse({'error': 'Wrong password'}, status=401)
        except Auth.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404) 
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)   

def forgot(request):
    return JsonResponse({'message': list(Auth.objects.all().values())})
