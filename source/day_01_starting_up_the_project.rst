.. index::
   single: Day 1: Starting up the Project

Day 1: Starting up the Project
==============================

Initializing the Project Directory
``````````````````````````````````

Before installing symfony, you first need to create a directory that will host all the files related to Jobeet:

.. code-block:: bash

    $ mkdir ~/projects/jobeet
    $ cd ~/projects/jobeet/

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

    wget http://symfony.com/download?v=Symfony_Standard_Vendors_2.0.10.tgz -O Symfony_Standard_Vendors_2.0.10.tgz && tar -xvzf Symfony_Standard_Vendors_2.0.10.tgz && mv Symfony/* . && rm -rf Symfony* && ls -l

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

No need to write about it, when there is `documentation available`_ at symfony website.

.. _`documentation available`: http://symfony.com/doc/current/book/installation.html#configuration-and-setup

However, if you're looking for quick copy/paste snippet, here it is:

.. code-block:: bash

    rm -rf app/cache/* && rm -rf app/logs/* && chmod 777 app/cache app/logs

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

    cd /etc/nginx/sites-available/ && sudo vim jobeet.dev

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

    cd ../sites-enabled/ && sudo ln -s ../sites-available/jobeet.dev && sudo /etc/init.d/nginx restart

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

Well, the day 1 is over. However if you're looking for installing Symfony 2 using Subversion or Git you can continue reading.

Installing Symfony 2 using Subversion
`````````````````````````````````````

Installing Symfony 2 using Git
``````````````````````````````

