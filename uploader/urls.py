from django.conf.urls import url, include

from . import views

app_name = "uploader"
urlpatterns = [
    # url(r'^(?P<year>\d{4})/(?P<month>\d{1,2})/$', views.view_files, name="view_files"),
    url(r'^$', views.view_files,),
    url(r'^index/$', views.view_files, name="index"),
    # url(r'^all/$', views.all_index, name="all_index"),
    # url(r'^download_rcv/(?P<rcv_filename>.+)$', views.download_rcv, name="download_rcv"),
    # url(r'^view_rcv/(?P<rcv_filename>.+)$', views.view_rcv, name="view_rcv"),
    url(r'^upload_file/$', views.upload_file, name="upload_file"),
    # url(r'^upload_files/$', views.upload_files, name="upload_files"),
    # url(r'^check_files_to_model/$',  views.check_files_to_model, name='check_files_to_model'),
    # url(r'delete/$', views.delete, name='delete'),
    # url(r'^test/$', views.test),
    # url(r'^edit/(?P<filename>.+)$', views.edit_name, name="edit"),
    #
    # url(r'^edit_list/$', views.view_edit_list, name="edit_list"),
    # url(r'^search_rcv/?$', views.search_rcv, name="search_rcv"),

    url(r'^download_file/(?P<filemanager_id>\d+)/$', views.download_file, name="download_file"),
]