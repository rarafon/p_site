from django.db import models

# Create your models here.
class TrackingType(models.Model):
    name = models.CharField(max_length=50)

class Tracking_Number(models.Model):
    number = models.CharField(max_length=25)
    input_date = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    receive_date = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    tracking_type =  models.ForeignKey(TrackingType, on_delete=models.CASCADE, blank=True, null=True)
    note = models.TextField()

    @classmethod
    def create(cls, tracking_info_dic):
        tracking_num = tracking_info_dic["tracking_number"]
        tracking_type = tracking_info_dic["tracking_type"]
        note = tracking_info_dic["note"]

        try:
            tracking_type = TrackingType.objects.get(name = tracking_type)
        except TrackingType.DoesNotExist as e:
            tracking_type = TrackingType(name = tracking_type)
            tracking_type.save()
        
        tracking_num_obj = cls(number=tracking_num, tracking_type=tracking_type,
                            note=note)
        tracking_num_obj.save()
        return tracking_num_obj.get_data_obj()

    def get_data_obj(self):
        o = {}
        o["tracking_number"] = self.number
        o["input_date"] = self.input_date
        return o
    
    @classmethod
    def get_data(cls):
        data = {}
        tracking_objs = cls.objects.all()
        for obj in tracking_objs:
            data[obj.number] = obj.get_data_obj()
        return data