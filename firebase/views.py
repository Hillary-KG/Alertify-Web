from django.shortcuts import render
from django.views.generic import View
import pusher
import json

# Create your views here.

def push(request):
    json_alert = json.loads(request.POST.get("alert"))
    message = "A new alert came in \n" + json_alert

    pusher_client = pusher.Pusher(
        app_id = "1037061",
        key = "02a565074fda23006d95",
        secret = "713ce78f98c12ce8b582",
        cluster = "mt1",
        ssl=False
    )

    pusher_client.trigger('my-channel', 'my-event', {'message': 'hello world'})

# def get(self, request, *args, **kwargs):
#     return render(request, 'fcm/firebase-messaging-sw.js', content_type="application/x-javascript")
