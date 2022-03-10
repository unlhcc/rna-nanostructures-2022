import os

from django.apps import AppConfig

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

class Settings:
    WEBPACK_LOADER = {
        "HCC_RNAMAKE": {
            "BUNDLE_DIR_NAME": "hcc_rnamake_portal/dist/",  # must end with slash
            "STATS_FILE": os.path.join(
                BASE_DIR,
                "static",
                "hcc_rnamake_portal",
                "dist",
                "webpack-stats.json",
            ),
        }
    }

class HccRnamakePortalConfig(AppConfig):
    # Standard Django app configuration. For more information on these settings,
    # see https://docs.djangoproject.com/en/2.2/ref/applications/#application-configuration
    name = 'hcc_rnamake_portal'
    label = name
    verbose_name = "HCC RNAMake Portal"

    # The following are Airavata Django Portal specific custom Django app settings

    # Set url_home to a namespaced URL that will be the homepage when the custom
    # app is selected from the main menu
    url_home = "hcc_rnamake_portal:home"

    # Set fa_icon_class to a FontAwesome CSS class for an icon to associate with
    # the custom app. Find an icon class at https://fontawesome.com/icons?d=gallery&p=2&s=regular,solid&m=free
    fa_icon_class = "fa-circle"

    # Second level navigation. Defines sub-navigation that displays on the left
    # hand side navigation bar in the Django Portal. This is optional but
    # recommended if your custom Django app has multiple entry points. See the
    # description of *nav* in
    # https://apache-airavata-django-portal.readthedocs.io/en/latest/dev/new_django_app/#appconfig-settings
    # for more details for more details.
    settings = Settings()
    
    url_prefix = 'rnamake_portal'
