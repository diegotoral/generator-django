import django.db.models

class Wager(django.db.models.Model):
    title = django.db.models.CharField(max_length=250)
    lose_condition = django.db.models.TextField(default='')
    created_date = django.db.models.DateTimeField(auto_now=True)
    published_date = django.db.models.DateField(null=True)
    completed_date = django.db.models.TimeField(null=True)
    is_free = django.db.models.BooleanField(default=False)
    is_win = django.db.models.NullBooleanField()
    user = django.db.models.ForeignKey('django.contrib.auth.models.User', related_name='wagers')
    tags = django.db.models.ManyToManyField('Tag')
    category = django.db.models.IntegerField()
    choice = django.db.models.OneToOneField('events.EventChoice', null=True, primary_key=True)
    amount = django.db.models.DecimalField(max_digits=6, decimal_places=3)
    pdf = django.db.models.FileField(max_length=199, upload_to='folder')
    ad = django.db.models.ImageField(null=True, max_length=100, upload_to='images')
    the_url = django.db.models.URLField(max_length=200)
    def __unicode__(self):
        return self.title

class Tag(django.db.models.Model):

    def __unicode__(self):
        pass
