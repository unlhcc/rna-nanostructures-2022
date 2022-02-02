# -*- coding: utf-8 -*-
# Generated by Django 1.11.21 on 2019-07-11 14:38
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('django_airavata_api', '0001_squashed_0004_auto_20190625_1938'),
    ]

    operations = [
        migrations.CreateModel(
            name='User_Notifications',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(max_length=64)),
                ('notification_id', models.CharField(max_length=255)),
                ('is_read', models.BooleanField(default=False)),
            ],
        ),
        migrations.AlterUniqueTogether(
            name='user_notifications',
            unique_together=set([('username', 'notification_id')]),
        ),
    ]
