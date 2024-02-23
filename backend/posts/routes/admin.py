from flask import Blueprint, request
from services.admin import post_report_details, post_reports, update_the_post_report


adminpost_route = Blueprint('adminpost_route', __name__)


@adminpost_route.get('/get_post_reports/<string:page>')
def get_post_reports(page):
    return post_reports(page=int(page))


@adminpost_route.get('/get_post_report/<string:report_id>')
def get_post_report(report_id):
    return post_report_details(report_id)


@adminpost_route.post('/update_post_report')
def update_post_report():
    return update_the_post_report(request)
