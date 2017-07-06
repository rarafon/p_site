from django.db import models
import django, os
from django.conf import settings

class CustomsDeclaration(models.Model):
    customs_number = models.CharField(max_length=13, default="")
    filename = models.CharField(max_length=50, default="")
    upload_date = models.DateField(default=django.utils.timezone.now)

    def __str__(self):
        return self.filename

    def delete(self):
        super(CustomsDeclaration, self).delete()
        os.remove(os.path.join(settings.MEDIA_ROOT, "customs_declaration", self.filename))

class RCV(models.Model):
    rcv_number = models.CharField(max_length=14)
    filename = models.CharField(max_length=50, default='')
    rcv_date = models.DateField(default=django.utils.timezone.now)
    upload_date = models.DateField(default=django.utils.timezone.now)

    def __str__(self):
        return self.filename

    def process(self):
        pass