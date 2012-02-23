.. index::
   single: Day 3: The Data Model

Day 3: The Data Model
=====================

Bundles
```````

In the Symfony 2.0 you organize your code into the bundles. Because the chapter
is about data model, we're not going to talk bundles here. But we need one to
start working on data model. So for now lets quickly create one like this:

.. code-block:: bash

    ./app/console generate:bundle --namespace=Nixilla/JobeetBundle --format=yml

This command will unleash the power of Symfony 2 interactive command line and
it'll start asking you millions of questions. For now just hit enter to accept
default values for all questions.

Configure database
``````````````````

Now we need to configure the database for our project. Unlike the Symfony 1.4,
where credentials were in config/databases.yml, Symfony 2.0 uses properties.ini
file for database credentials.

The easiest way is to visit `configurator module`_ on your new application.

.. _`configurator module`: http://jobeet.dev/_configurator

Follow the steps and you'll get your database connection configured. You'll
also set up CSRF secret there. If your web server does not have write
permission to app/config/parameters.ini, you'll be asked to manually
paste the content to this file.

Once you finish with this task, you can come back to command line and create
your database.

.. code-block:: bash

    ./app/console doctrine:database:create

Now we're going to define our models

.. note:: Doctrine 2 does not support natively behaviour like it does in Doctrine 1.2.
          Therefore you need to install third party extension as described `here`_.
          We'll skip the behaviours for now, so we can quickly get started.

.. _`here`: http://symfony.com/doc/current/cookbook/doctrine/common_extensions.html

Create schema
`````````````

Unlike Symfony 1.4 where you creare config/doctrine/schema.yml and define you models,
in Symfony 2.0 you first create model classes POPOs (Plain Old PHP Objects) which
do not inherit from anything.

Later Doctrine 2 creates classes which inherit from yours' and implements the magic.
So it's the other way around then in Doctrine 1.2

Now lets create first model class using following commands:

.. code-block:: bash

    ./app/console doctrine:generate:entity

This is another interactive command and it'll ask you number of questions, so lets go ...

.. code-block:: text

    Welcome to the Doctrine2 entity generator

    This command helps you generate Doctrine2 entities.

    First, you need to give the entity name you want to generate.
    You must use the shortcut notation like AcmeBlogBundle:Post.

    The Entity shortcut name: NixillaJobeetBundle:JobeetCategory

    Determine the format to use for the mapping information.

    Configuration format (yml, xml, php, or annotation) [annotation]:

    Instead of starting with a blank entity, you can add some fields now.
    Note that the primary key will be added automatically (named id).

    Available types: array, object, boolean, integer, smallint,
    bigint, string, text, datetime, datetimetz, date, time, decimal, float.

    New field name (press <return> to stop adding fields): name
    Field type [string]:
    Field length [255]:

    New field name (press <return> to stop adding fields):

    Do you want to generate an empty repository class [no]? yes

    Summary before generation

    You are going to generate a "NixillaJobeetBundle:JobeetCategory" Doctrine2 entity
    using the "annotation" format.

    Do you confirm generation [yes]?

    Entity generation

    Generating the entity code: OK

    You can now start using the generated code!

Now have a look on 2 new files located in `src/Nixilla/JobeetBundle/Entity`_.
The repository class is equivalent of Table class in Doctrine 1.2.

.. _`src/Nixilla/JobeetBundle/Entity`: https://github.com/nixilla/Symfony2-Jobeet/tree/5803e80162f50fa0798b21bbebe349dee62e1d6b/src/Nixilla/JobeetBundle/Entity

Let's add next class but this time we'll use Yaml comfiguration format, we're also create model with relation.

.. code-block:: bash

    ./app/console doctrine:generate:entity --entity=NixillaJobeetBundle:JobeetJob --format=yml --with-repository

and the output (bit shorter version):

.. code-block:: text

    The Entity shortcut name [NixillaJobeetBundle:JobeetJob]:
    Configuration format (yml, xml, php, or annotation) [yml]:
    New field name (press <return> to stop adding fields): type
    Field type [string]:
    Field length [255]:

    New field name (press <return> to stop adding fields): company
    Field type [string]:
    Field length [255]:

    New field name (press <return> to stop adding fields): logo
    Field type [string]:
    Field length [255]:

    New field name (press <return> to stop adding fields): url
    Field type [string]:
    Field length [255]:

    New field name (press <return> to stop adding fields): position
    Field type [string]:
    Field length [255]:

    New field name (press <return> to stop adding fields): location
    Field type [string]:
    Field length [255]:

    New field name (press <return> to stop adding fields): description
    Field type [string]:
    Field length [255]: 4000

    New field name (press <return> to stop adding fields): how_to_apply
    Field type [string]:
    Field length [255]: 4000

    New field name (press <return> to stop adding fields): token
    Field type [string]:
    Field length [255]:

    New field name (press <return> to stop adding fields): is_public
    Field type [string]: boolean

    New field name (press <return> to stop adding fields): is_activated
    Field type [string]: boolean

    New field name (press <return> to stop adding fields): email
    Field type [string]:
    Field length [255]:

    New field name (press <return> to stop adding fields): expires_at
    Field type [datetime]:

    New field name (press <return> to stop adding fields):

    Do you want to generate an empty repository class [yes]?

    Do you confirm generation [yes]?

    Generating the entity code: OK

`Click here`_ to find out what this command does.

.. _`Click here`: https://github.com/nixilla/Symfony2-Jobeet/commit/8a4fc25a69225157d0056bbbc7c5748a93050083

As you can see the difference between the *annotations* and *yml* configuration
format relates to the meta information being saved into yaml file.

.. note:: It's better for you if you use one type of configuration formats,
          otherwise you won't be able to build the database. Here I'm just exploring the
          differences between the formats. I'll continue with Yaml format from now on.

As you can see, I haven't defined the relation yet. According to the
`documentation page`_, all I need to do is to add manyToOne to yml file.

.. _`documentation page`: http://symfony.com/doc/current/book/doctrine.html#relationship-mapping-metadata

.. code-block:: yaml

    Nixilla\JobeetBundle\Entity\JobeetJob:
      type: entity
      table: null
      fields:
        # fields defition here
      lifecycleCallbacks: {  }
      manyToOne:
        category:
          targetEntity: JobeetCategory
          inversedBy: jobs
          joinColumn:
            name: category_id
            referencedColumnName: id

I also need to add *OneToMany* annotation on JobeetCategory:

.. code-block:: yaml

    Nixilla\JobeetBundle\Entity\JobeetCategory:
      # ...
      oneToMany:
        JobeetJobs:
          targetEntity: JobeetJob
          mappedBy: jobs

Now run this command to updated getters and setters for JobeetJob, since you added new property *category*

.. code-block:: bash

    ./app/console doctrine:generate:entities Nixilla

This command makes a copy of all files which are affected by its execution,
which is quite annoying when you use VCS, however there is *---no-backup* option
which disables this behaviour. Before you commit make sure that you remove all
backups.

.. code-block:: bash

    rm -rf src/Nixilla/JobeetBundle/Entity/*.php~


To check what has changed since last commit follow `this link`_.

.. _`this link`: https://github.com/nixilla/Symfony2-Jobeet/commit/452bd21d20187b774a9f07511a28b6ed97867e8d

Now we need to add two more model *JobeetAffiliate* and create link to JobeetCategory
using *JobeetCategoryAffiliate* link table.

.. note:: As you can see from the data model in chapter 2, the JobeetCategoryAffiliate
          is the link table, between JobeetAffiliate and JobeetCategory in many-to-many
          relation. In Doctrine 2 you don't define this table in your classes/yaml.
          Doctrine 2 will created this table for you. Have a look on `Doctrine documentation page`_.

.. _`Doctrine documentation page`: http://docs.doctrine-project.org/projects/doctrine-orm/en/2.0.x/reference/association-mapping.html#many-to-many-unidirectional

So, to define many-to-many relation between 2 models, using YAML you need to
add manyToMany section into relevant class. If you add this section to both
classes, you'll get bi-directional relation. But here I'am going to use
unidirectional - same as the in the original Jobeet project.

.. code-block:: yaml

    Nixilla\JobeetBundle\Entity\JobeetAffiliate:
      # ...
      manyToMany:
        JobeetCategories:
          targetEntity: JobeetCategory
          joinTable:
            name: JobeetCategoryAffiliate
            joinColumns:
              category_id:
                referencedColumnName: id
            inverseJoinColumns:
              affiliate_id:
                referencedColumnName: id

Now rerun:

.. code-block:: bash

    ./app/console doctrine:generate:entities --no-backup Nixilla

Doctrine Constrains
'''''''''''''''''''

As you probably noticed, I haven't defined any notnull values as in Doctrine 1.2 schema.yml. Let's do it now.

.. configuration-block::

    .. code-block:: yaml

        # before
        Nixilla\JobeetBundle\Entity\JobeetJob:
          type: entity
          table: null
          fields:
            id:           { type: integer, id: true, generator: { strategy: AUTO } }
            type:         { type: string, length: 255 }
            company:      { type: string, length: 255 }
            logo:         { type: string, length: 255 }
            url:          { type: string, length: 255 }
            position:     { type: string, length: 255 }
            location:     { type: string, length: 255 }
            description:  { type: string, length: '4000' }
            how_to_apply: { type: string, length: '4000' }
            token:        { type: string, length: 255 }
            is_public:    { type: boolean }
            is_activated: { type: boolean }
            email:        { type: string, length: 255 }
            expires_at:   { type: datetime }
          lifecycleCallbacks: {  }
          manyToOne:
            JobeetCategory:
              targetEntity: JobeetCategory
              inversedBy: jobs
              joinColumn:
                name: category_id
                referencedColumnName: id

    .. code-block:: yaml

        # after
        Nixilla\JobeetBundle\Entity\JobeetJob:
          type: entity
          table: null
          fields:
            id:           { type: integer, id: true, generator: { strategy: AUTO } }
            type:         { type: string, length: 255, nullable: true }
            company:      { type: string, length: 255 }
            logo:         { type: string, length: 255, nullable: true }
            url:          { type: string, length: 255, nullable: true }
            position:     { type: string, length: 255 }
            location:     { type: string, length: 255 }
            description:  { type: string, length: '4000' }
            how_to_apply: { type: string, length: '4000' }
            token:        { type: string, length: 255, unique: true }
            is_public:    { type: boolean }
            is_activated: { type: boolean }
            email:        { type: string, length: 255 }
            expires_at:   { type: datetime }
          lifecycleCallbacks: {  }
          manyToOne:
            JobeetCategory:
              targetEntity: JobeetCategory
              inversedBy: jobs
              joinColumn:
                name: category_id
                referencedColumnName: id

    .. code-block:: yaml

        # Doctrine 1.2 just for reference
        JobeetJob:
          actAs:
            Timestampable: ~
          columns:
            category_id:  { type: integer, notnull: true }
            type:         { type: string(255) }
            company:      { type: string(255), notnull: true }
            logo:         { type: string(255) }
            url:          { type: string(255) }
            position:     { type: string(255), notnull: true }
            location:     { type: string(255), notnull: true }
            description:  { type: string(4000), notnull: true }
            how_to_apply: { type: string(4000), notnull: true }
            token:        { type: string(255), notnull: true, unique: true }
            is_public:    { type: boolean, notnull: true, default: 1 }
            is_activated: { type: boolean, notnull: true, default: 0 }
            email:        { type: string(255), notnull: true }
            expires_at:   { type: timestamp, notnull: true }
          relations:
            JobeetCategory: { onDelete: CASCADE, local: category_id, foreign: id, foreignAlias: JobeetJobs }


Testing the models
``````````````````

In this moment we should be able to interact with database using our newly created model classes.


