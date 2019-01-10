from django.db import models
from datetime import datetime
from pytz import timezone

# Create your models here.
class TrackingType(models.Model):
    name = models.CharField(max_length=50)

    @classmethod
    def get_types(cls):
        # Returns dictionary with k/v being string name of type / id.
        types = {}
        types_q = cls.objects.all()
        for type_o in types_q:
            types[type_o.name] = type_o.id
        return types


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
        o["id"] = self.pk

        o["tracking_number"] = self.number
        # d - Datetime field
        d = self.input_date.astimezone(timezone('America/Los_Angeles'))
        date_string = d.strftime("%Y-%m-%d %H:%M:%S %Z")
        o["input_date"] = date_string
        o["type"] = self.tracking_type.name;
        return o
    
    @classmethod
    def get_data(cls):
        data = {}
        tracking_objs = cls.objects.all()
        for obj in tracking_objs:
            data[obj.id] = obj.get_data_obj()
        return data

    @classmethod
    def delete_by_id(cls, o_id):
        cls.objects.get(id=o_id).delete()
        return o_id