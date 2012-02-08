.. index::
   single: Day 1: Starting up the Project

Day 1: Starting up the Project
==============================

Symfony2 Installation
---------------------

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

    $ wget http://symfony.com/download?v=Symfony_Standard_Vendors_2.0.10.tgz -O Symfony_Standard_Vendors_2.0.10.tgz && tar -xvzf Symfony_Standard_Vendors_2.0.10.tgz && mv Symfony/* . && rm -rf Symfony* && ls -l

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


