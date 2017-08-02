from django.contrib import admin
from .models import Location, Item, DataDate

class LocationAdmin(admin.ModelAdmin):
    list_display = ('loc', 'warehouse_location', 'area', 'aisle_letter', 'aisle_num', 'level', 'column')

admin.site.register(Location, LocationAdmin)

class ItemAdmin(admin.ModelAdmin):
    list_display = ("id", "rack_location", "data_date", "quantity")

admin.site.register(Item, ItemAdmin)

class DataDateAdmin(admin.ModelAdmin):
    list_display = ("date",)

admin.site.register(DataDate, DataDateAdmin)