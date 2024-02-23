from flask import jsonify, request
from bson import ObjectId
from serializers.serializer import PostReportSchema
from models.models import Post, Report


def post_reports(page, page_size=10):
    if not page:
        return jsonify({'error': 'Invalid data'}), 400
    
    skip = (page-1)*page_size
    report_objs = Report.objects.filter(reviewed=False).order_by('-reported_at').skip(skip).limit(page_size)
    total_pages = Report.objects.count()
    
    reports = [
        {
            'report_id': str(report.id),
            'reporter': {
                'id': str(report.reported_by.id),
                'name': report.reported_by.name,
                'profile_picture': report.reported_by.profile_picture,
                },
            'reported_at': report.reported_at.strftime('%d %B %Y at %I:%M %p')
             
        } for report in report_objs
    ]
    
    return jsonify({'reports': reports, 'total_pages': total_pages}), 200


def post_report_details(report_id):
    if not report_id:
        return jsonify({'error': 'Invalid data'}), 400
    
    report_obj  = Report.objects.filter(id=report_id).first()
    if not report_obj:
        return jsonify({'error': 'Report not found'}), 404
    
    report_schema = PostReportSchema()
    report = report_schema.dump(report_obj)
    return jsonify({'report': report}), 200


def update_the_post_report(request):
    data = request.get_json()
    report_id = data.get('report_id', None)
    comment = data.get('comment', None)
    post_id = data.get('post_id', None)
    
    if not report_id:
        return jsonify({'error': 'Invalid data'}), 400
    
    if not comment:
        return jsonify({'error': 'Comment not entered'}), 400
    
    report = Report.objects.filter(id=report_id).first()
    if not report:
        return jsonify({'error': 'Report not found'}), 404
    
    report.reviewed = True
    report.review_comment = comment
    report.save()
    
    if not post_id:
        return jsonify({'message': 'Report: Post Approved'}), 200
    
    post = Post.objects.filter(id=post_id).first()
    post.is_blocked = True
    post.save()
    
    return jsonify({'message': 'Report: Post Blocked'}), 200
    
    
    