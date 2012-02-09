.. index::
   single: Day 1: Starting up the Project

Day 1: Starting up the Project
==============================

Initializing the Project Directory
``````````````````````````````````

Before installing symfony, you first need to create a directory that will host all the files related to Jobeet:

.. code-block:: bash

    mkdir ~/projects/jobeet && \
    cd ~/projects/jobeet/

Downloading and Installing Symfony2 from Symfony.com website
````````````````````````````````````````````````````````````

You can install Symfony2 in the number of ways. The first one, is to download
Symfony2 framework from the website_. There are 2 versions available, one
with vendors and one without.

.. _website: http://symfony.com/download

Now, go to symfony website and download the latest version with vendors, or you can use wget and tar to do it quickly:

.. code-block:: bash

    $ wget http://symfony.com/download?v=Symfony_Standard_Vendors_2.0.10.tgz -O Symfony_Standard_Vendors_2.0.10.tgz
    $ tar -xvzf Symfony_Standard_Vendors_2.0.10.tgz
    $ mv Symfony/* .
    $ rm -rf Symfony*
    $ ls -l
    total 40
    drwxr-xr-x  6 janusz developers 4096 Feb  8 00:16 app
    drwxr-xr-x  2 janusz developers 4096 Feb  8 00:16 bin
    -rw-r--r--  1 janusz developers 1574 Feb  6 11:04 deps
    -rw-r--r--  1 janusz developers  486 Feb  6 11:04 deps.lock
    -rw-r--r--  1 janusz developers 1065 Feb  6 11:04 LICENSE
    -rw-r--r--  1 janusz developers 6407 Feb  6 11:04 README.md
    drwxr-xr-x  3 janusz developers 4096 Feb  8 00:16 src
    drwxr-xr-x 14 janusz developers 4096 Feb  8 00:16 vendor
    drwxr-xr-x  3 janusz developers 4096 Feb  6 11:04 web

If you're looking for copy/paste command - here it is:

.. code-block:: bash

    wget http://symfony.com/download?v=Symfony_Standard_Vendors_2.0.10.tgz -O Symfony_Standard_Vendors_2.0.10.tgz && \
    tar -xvzf Symfony_Standard_Vendors_2.0.10.tgz && \
    mv Symfony/* . && \
    rm -rf Symfony* && \
    ls -l \
    ./app/console -V

Installation Verification
`````````````````````````

.. code-block:: bash

    $ ./app/console -V
    Symfony version 2.0.10 - app/dev/debug

Project Setup/Creation
``````````````````````

As oppose to Symfony 1.4 you alrady have your project set up, you don't need to
create project and apps (frontend and backend).

The downloaded package aready have you default directory structure, here is the brief description:

+-----------+------------------------------------------------------------------------------+
| Directory | Description                                                                  |
+===========+==============================================================================+
| app       | In Symfony 2 you can only have one application and it sits in this directory |
+-----------+------------------------------------------------------------------------------+
| bin       | contains script to install vendors                                           |
+-----------+------------------------------------------------------------------------------+
| src       | This is where you put your bundles                                           |
+-----------+------------------------------------------------------------------------------+
| vendor    | equivalent of lib/vendor in Symfony 1.4                                      |
+-----------+------------------------------------------------------------------------------+
| web       | same as in Symfony 1.4                                                       |
+-----------+------------------------------------------------------------------------------+

For more information about directory structure please visit `How Symfony2 differs from symfony1`_

.. _`How Symfony2 differs from symfony1`: http://symfony.com/doc/2.0/cookbook/symfony1.html

Directory Structure Permissions
```````````````````````````````

There is no need to write about it, when there is `documentation available`_ at symfony website.

.. _`documentation available`: http://symfony.com/doc/current/book/installation.html#configuration-and-setup

However, if you're looking for quick copy/paste snippet, here it is:

.. code-block:: bash

    rm -rf app/cache/* && \
    rm -rf app/logs/* && \
    chmod 777 app/cache app/logs

Web Server Configuration: The ugly Way
``````````````````````````````````````

This will never happen here.

Web Server Configuration: The secure Way
````````````````````````````````````````

Since I'm Nginx user, I'll show you how to set up Nginx to work with Symfony 2 application. I won't write here how to setup Apache, but I'm sure it's easy to find it on the web.

Nginx config (/etc/nginx/sites-available/jobeet.dev)
''''''''''''''''''''''''''''''''''''''''''''''''''''

.. note:: This section needs to be done as root or with sudo.

I'm assuming that you're using Nginx + PHP-FPM.

.. code-block:: bash

    cd /etc/nginx/sites-available/ && \
    sudo vim jobeet.dev

Put this inside the jobeet.dev file, make sure that you adjust your paths

.. code-block:: nginx

    server {
      listen 80;
      server_name jobeet.dev;
      root /home/janusz/projects/jobeet/web;
      index app_dev.php;

      access_log /var/log/nginx/jobeet.dev.access_log main;
      error_log /var/log/nginx/jobeet.dev.error_log info;

      location / {
        if (-f $request_filename) {
          expires max;
          break;
        }

        if ($request_filename !~ "\.(js|htc|ico|gif|jpg|png|css)$") {
          rewrite ^(.*) /app_dev.php last;
        }
      }

      location ~ \.php($|/) {
        set $script $uri;
        set  $path_info  "";
        if ($uri ~ "^(.+\.php)(/.+)") {
          set $script $1;
          set $path_info $2;
        }

        fastcgi_pass 127.0.0.1:9000;
        include fastcgi_params;
        fastcgi_param PATH_INFO $path_info;
        fastcgi_param SCRIPT_FILENAME $document_root/$script;
        fastcgi_param SCRIPT_NAME $script;
      }
    }

then:

.. code-block:: bash

    cd ../sites-enabled/ && \
    sudo ln -s ../sites-available/jobeet.dev && \
    sudo /etc/init.d/nginx restart

You also need to somehow let know you computer (the one with the browser) what's the IP address for jobeet.dev

Since I'm using Gentoo Linux, I usually modify my /etc/hosts file with something like this:

.. code-block:: bash

    # IP_address hostnamne
    127.0.0.1 jobeet.dev
    # or if you're using different host for development - network server or virtual machine
    192.168.1.100 jobeet.dev

Test the New Configuration
``````````````````````````

Now you can go to `your new project`_.

.. _`your new project`: http://jobeet.dev/

If you get *You are not allowed to access this file. Check app_dev.php for more information.*, **remove** following lines (7 to 15) in the *web/app_dev.php* file.

.. code-block:: php

    <?php

    // this check prevents access to debug front controllers that are deployed by accident to production servers.
    // feel free to remove this, extend it, or make something more sophisticated.
    if (!in_array(@$_SERVER['REMOTE_ADDR'], array(
      '127.0.0.1',
      '::1',
    ))) {
      header('HTTP/1.0 403 Forbidden');
      exit('You are not allowed to access this file. Check '.basename(__FILE__).' for more information.');
    }

Now you should see the Symfony 2 Welcome screen. Well, at least I can see it :-)

.. image:: _static/welcome.jpg

Well, the day 1 is over. However if you're looking for installing Symfony 2
using Subversion or Git you can continue reading. Optionally you may want
to remove AcmeDemoBundle, which is a sample Symfony 2 application.

Managing Symfony 2 project with Version Control Systems
```````````````````````````````````````````````````````

Subversion
''''''''''

Unlike Symfony 1.4 project where you initialize empty directory as your
Subversion repository, and then you gradually add stuff, i.e. vendors,
plugins, project, frontend and backend app, in Symfony 2.0, once you donwload
Symfony Standard without vendors, you alredy have your project and app
(frontend or backend as you only can have one).

In Symfony 1.4 you usually define lib/vendor/symfony as svn:external bound to
latest tag i.e. http://svn.symfony-project.com/tags/RELEASE_1_4_15.
When new release is available you are editing your svn:externals and update tag
to http://svn.symfony-project.com/tags/RELEASE_1_4_16 and then run svn update.

It's very similar with plugins. If the plugins you're using have tags you bind
your svn:externals to these tags, if not - you usually bind to trunk or
branches. Personally I don't like this approach as I never know whether the
version of the plugin is stable or not.

In Symfony 2.0 you don't define vendors as svn:externals but as svn:ignore.

.. note:: Even if your using Subversion you still need Git installed on you dev machine as the bin/vendors script requires it

Symfony 2.0 handles dependencies using bin/vendors script. This script
grabs all repositories required for you project which are defined in deps and
deps.lock files.

So, for example, if you have project running Symfony 2.0.9, and there is 2.0.10
available all you need to do is download latest deps and deps.lock files and run
bin/vendors script. Of course it's highly recommended that you'll read the
blog post related to the update as there may be some additional things to do.

Quick update copy/paste snippet:

.. note:: If you modified your deps and deps.lock files the command below will override them, so presumably you need to manually merge the changes instead.

.. code-block:: bash

    wget https://raw.github.com/symfony/symfony-standard/v2.0.10/deps -O deps && \
    wget https://raw.github.com/symfony/symfony-standard/v2.0.10/deps.lock -O deps.lock && \
    ./bin/vendors install

Seting up the brend new project in Subversion
'''''''''''''''''''''''''''''''''''''''''''''

The following few lines come from orginal Practical Symfony for Symfony 1.4

First, create a repository for the jobeet project on the repository server:

.. code-block:: bash

    svnadmin create /path/to/jobeet/repository

On your machine, create the basic directory structure:

.. code-block:: bash

    svn mkdir -m "created default directory structure" http://svn.example.com/jobeet/trunk http://svn.example.com/jobeet/tags http://svn.example.com/jobeet/branches

And checkout the empty trunk/ to new directory:

.. code-block:: bash

    mkdir ~/projects/jobeet && \
    cd ~/projects/jobeet/ && \
    svn co http://svn.example.com/jobeet/trunk/ .

Donwload and install latest Symofny 2 without vendors:

.. code-block:: bash

    wget http://symfony.com/download?v=Symfony_Standard_2.0.10.tgz -O Symfony_Standard_2.0.10.tgz && \
    tar -xvzf Symfony_Standard_2.0.10.tgz && \
    mv Symfony/* . && \
    rm -rf Symfony* && \
    ./bin/vendors install && \
    ./app/console -V

Now add project to repository (based on information found on `this page`_):

.. _`this page`: http://symfony.com/doc/2.0/cookbook/workflow/new_project_svn.html

.. code-block:: bash

    svn add --depth=empty app app/cache app/logs app/config web && \
    svn propset svn:ignore "vendor" . && \
    svn propset svn:ignore "bootstrap*" app/ && \
    svn propset svn:ignore "parameters.ini" app/config/ && \
    svn propset svn:ignore "*" app/cache/ && \
    svn propset svn:ignore "*" app/logs/ && \
    svn propset svn:ignore "bundles" web && \
    svn ci -m "commit basic symfony ignore list (vendor, app/bootstrap*, app/config/parameters.ini, app/cache/*, app/logs/*, web/bundles)" && \
    svn add --force . && \
    svn ci -m "add basic Symfony Standard 2.0.10"

And now you have working SVN repository with Symfony 2.0.10 project. Enjoy!

Git
'''

There is a documentation on how to create Symfony 2 Git repository available on
`Symfony website`_, but if you're looking for copy/paste snippet, here it is:

.. _`Symfony website`: http://symfony.com/doc/2.0/cookbook/workflow/new_project_git.html

.. code-block:: bash

    mkdir ~/projects/jobeet && \
    cd ~/projects/jobeet/ && \
    echo -e "/web/bundles/\n/app/bootstrap*\n/app/cache/*\n/app/logs/*\n/vendor/\n/app/config/parameters.ini\n" > .gitignore && \
    wget http://symfony.com/download?v=Symfony_Standard_2.0.10.tgz -O Symfony_Standard_2.0.10.tgz && \
    tar -xvzf Symfony_Standard_2.0.10.tgz && \
    mv Symfony/* . && \
    rm -rf Symfony* && \
    cp app/config/parameters.ini app/config/parameters.ini.dist && \
    git init && \
    git add . && \
    git commit -m "Initial commit" && \
    ./bin/vendors install && \
    ./app/console -V

Now you have working Git repository with Symfony 2.0 project. Enjoy!

Optionally Remove AcmeDemoBundle
````````````````````````````````

To remove AcmeDemoBundle you need to do it in 4 steps:

- remove directory *src/Acme* using:

.. code-block:: bash

    rm -rf src/Acme

- modify *app/AppKernel.php* and remove line:

.. code-block:: php

    $bundles[] = new Acme\DemoBundle\AcmeDemoBundle();

- remove related routes from the file *app/config/routing_dev.yml*:

.. code-block:: yaml

    _welcome:
      pattern:  /
      defaults: { _controller: AcmeDemoBundle:Welcome:index }

    _demo_secured:
      resource: "@AcmeDemoBundle/Controller/SecuredController.php"
      type:     annotation

    _demo:
      resource: "@AcmeDemoBundle/Controller/DemoController.php"
      type:     annotation
      prefix:   /demo

- clear cache

.. code-block:: bash

    ./app/console cache:clear


