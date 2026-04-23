from django.contrib import admin
from .models import Field

@admin.register(Field)
class FieldAdmin(admin.ModelAdmin):
    # 1. Fixed: Changed 'status' to 'computed_status' to match your model
    list_display = ('name', 'crop_type', 'current_stage', 'computed_status', 'agent')
    
    # 2. Fixed: Changed 'status' to 'current_stage' 
    # (Properties can't be used in list_filter because they aren't in the DB)
    list_filter = ('current_stage', 'crop_type')
    
    search_fields = ('name', 'crop_type')

    # Optional: Give the column a nice header in the Admin
    def computed_status(self, obj):
        return obj.computed_status
    computed_status.short_description = 'Status'