# Introduction

Nous allons créer un premier bundle `TestBundle` afin de prendre en main le paradigme MVC dans une structure 
Symfony2.

Process :

1. Création d'un bundle
2. Création d'un controller de Test
3. Création d'une action
4. Templating d'une action
5. Templating d'un layout
    1. HTML
    2. CSS / Assets
6. Tests fonctionnels
7. Doctrine / Entity
8. Formulaire

# Création du bundle

Pour cela nous allons utliser une ligne de commande qui va nous permettre de générer un skeleton de Bundle.

*Cette commande n'est à effectuer qu'en environnement de developpement*

```
$ app/console generate:bundle
```
Un certain nombre d'informations seront nécessaires :

1. Namespace
	1. Vendor / Créateur - `Lp`
	2. Nom du bundle - `Test`
	3. Suffixe obligatoire - `Bundle`
	4. Donc `Lp/TestBundle`
2. Choisir le nom - Par convention on utilise la définition du namespace sans slash
3. Choisir la destination - `src/` car bundle application métier
4. Format de configuration - Prendre `annotation`
5. Structure à générer - `no`
6. Confirmation


**Que s'est-il passé ?**

Il faut se rendre dans le répertoire `src/Lp/TestBundle` afin de voir que des fichiers ont été généré.

1. Fichier `LpTestBundle.php` qui est le seul fichier obligatoire afin de charger le bundle dans le Kernel
2. Autochargement dans le `AppKernel`
3. Enregistrement de la définition de nos routes dans `src/Lp/TestBundle/Resources/config/routing.yml`

# Création d'un controller

Dans un controller nommé `DemoController`, il nous faut différentes actions :

1. `index` : qui permet d'afficher un texte statique
2. `whatsMyName` : qui permet d'afficher une information en variable d'URL

Pour chacune de ses actions créer un template propre.

## Class Controller

Une Class Controller permet de gérer différentes actions appelées par le routing.

Lors de la génération du skeleton de notre bundle, nous avons un répertoire `Controller`. Si nous observons 
le fichier de routing de notre application 'app/config/routing.yml', on constate que nous chargeons toutes les actions
paramétrées dans les class se trouvant dans le dossier `Controller`

    lp_test:
        resource: "@LpTestBundle/Controller/"
        type:     annotation
        prefix:   /
    
    app:
        resource: "@AppBundle/Controller/"
        type:     annotation

Donc il suffit de créer la Class ci-dessous dans un fichier nommé `DemoController.php`(nommage autoload PSR-4) :
 
    <?php
    
    namespace Lp\TestBundle\Controller; # déclaration du namespace
    
    use Symfony\Bundle\FrameworkBundle\Controller\Controller; # import de la Class Controller (héritage)
    use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route; # utiliser pour configuration en annotation
    use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template; # utiliser pour configuration en annotation
    
    class DemoController extends Controller
    {
    
    }

Et pour créer une action, il suffit d'écrire une méthode annotée dans cette classe 

    /**
     * @Route("/index", name="_index") # route
     * @Template() # template partial appellé : LpTestBundle:Demo:index.html.twig
     */
    public function indexAction()
    {
        return array(   # retourne un tableau clé / valeur et les clés sont exposées dans le template
                // ...
            );    
	}
	
Il existe une commande afin de générer un controller :

    $ app/console generate:controller
	
## Gestion des paramètres en annotation
     
     /**
      * @Route("/index/{param}") # route
      * @Template() # template partial appellé : LpTestBundle:Demo:index.html.twig
      */
     public function indexAction($param)
     {
         return array(   # retourne un tableau clé / valeur et les clés sont exposées dans le template
                 // ...
             );    
 	}

Afin d'indiquer la récupération d'un paramètre, il faut le définir dans le route.
Il est passé en argument de la méthode.

**On peut y intégrer l'objet Request**

    use Symfony\Component\HttpFoundation\Request;
    
    public function indexAction(Request $request)
    {
        $page = $request->query->get('page', 1);
    
        // ...
    }

[<span class="btn btn-info">+ informations</span>](http://symfony.com/doc/current/book/controller.html)

# Gestion du templating

Le templating dans le framework Symfony est géré par défault avec Twig. 

Que ce soit au niveau App ou Bundle, tous les templates se localisent dans `Resources/views`.

## Localisé un template partial

A partir d'un controller afin d'éxécuter le rendu de l'action on fait appel à un template. Il est localisé en faisant 
appel à la méthode `render()` de la class `Symfony\Bundle\FrameworkBundle\Controller\Controller` dans laquelle est 
injecté le service `twig` à qui appartient cette fonction et renvoie un object `Response`.

**En PHP**

    // renders app/Resources/views/hello/greetings/index.html.twig
    return $this->render('hello/greetings/index.html.twig', array(
        'name' => $name
    ));

**En Annotation**

     /**
      * @Template("LpTestBundle:Demo:another.html.twig")
      */

## Gestion d'un layout

Par défault, la création du projet génère un template `app/Ressources/views/base.html.twig` (block mappés) et celui-ci 
peut-être étendu grâce à la fonction twig `{% extends ::base.html.twig %}`

On peut aussi stocké un layout dans nos Bundles. Afin de le localiser il faut utiliser le ShortName du Bundle 
`LpTestBundle:layout.html.twig` faisant référence au fichier se trouvant dans 
`src/Lp/TestBundle/Ressources/views/layout.html.twig` 

## Par exemple

Nous avons via la définition de notre routing attaqué le controller `LpTestBundle:DemoController:indexAction` qui par 
défault le rendu va être compilé dans le template `LpTestBundle:Demo:index.html.twig` qui est localisé dans 
`src/Lp/TestBundle/Resources/views/Demo/index.html.twig`. Dans ce template partial on fait appel à un layout que nous avons 
crééer dans notre Bundle `src/Lp/TestBundle/Resources/views/layout.html.twig`.

    # src/Lp/TestBundle/Resources/views/index.html.twig
    {% extends "LpTestBundle::layout.html.twig" %}
    
    {% block title %}LpTestBundle:Demo:index{% endblock %}
    
    {% block body %}
    	<h1>Welcome to the Demo:index page</h1>
    {% endblock %}

[<span class="btn btn-info">+ informations</span>](http://symfony.com/doc/current/book/templating.html)

## Créer son layout

Faire évoluer le layout en intégrant le [starter template bootstrap](https://getbootstrap.com/examples/starter-template/) en mappant 
les zones dynamiques suivantes (block):

* `{% block title %}` - balise title
* `{% block stylesheets %}` - import des CSS
* `{% block body %}` - corps balise body
* `{% block javascripts %}` - import des JS

**Faire appel via un CDN, les librairies externes (CSS/JS)**

    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css" integrity="sha512-dTfge/zgoMYpP7QbHy4gWMEGsbsdZeCXz7irItjcC3sPUFtf0kuFbDz/ixG7ArTxmDjLXDmezHubeNikyKGVyQ==" crossorigin="anonymous">
    
    <!-- Optional theme -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap-theme.min.css" integrity="sha384-aUGj/X2zp5rLCbBxumKTCw2Z50WgIr1vs/PFN4praOTvYXWlVyh2UtNUU0KAUhAX" crossorigin="anonymous">
    
    <!-- Latest compiled and minified JavaScript -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js" integrity="sha512-K1qjQ+NcF2TYO/eI3M6v8EiNYZfA95pQumfvcVrTHtwQVDG+aHRqLi/ETn2uB+1JqwYqVG3LIvdm9lj6imS/pQ==" crossorigin="anonymous"></script>

<p class="text-primary">Bien-sûr une fois correctement mappé, faire appel à ce layout dans le rendu des deux actions définies</p>

## Lien 

Dans le layout, mettre en place un menu avec les 2 actions définies dans la class DemoController

Afin de récupérer l'url d'une action il suffit d'utiliser le helper twig spécialement fait pour Symfony2 `path()`, 
qui prend comme premier argument le nom de la route et en second, un tableau `{}` qui représente les paramètres. 

    <a href="{{ path('_index') }}">Go to index</a>
    
**En annotation, on définit le nom d'une route comme ci-dessous**

    /**
     * @Route("/index", name="_index")
     * @Template()
     */

[<span class="btn btn-info">+ informations</span>](http://symfony.com/doc/current/book/templating.html#linking-to-pages)

## Web Assets

L'organisation des fichiers dans un projet symfony2 impose que seul le répertoire `web` est accessible du Web.
Nos fichiers static doivent y être donc stockés afin de les servir au client.

Ces assets, dépendants de nos bundles, doivent être stockés dans `src/Lp/TestBunble/Resources/public`. Afin de les 
rendre accessible, il faut les publier 

```
$ app/console assets:install --symlink
```

L'option `-symlink` permet de faire un lien symbolique.

Passer les assets appelés dans le layout en CDN par le bundle `LpTestBundle` en local.

**Par exemple**
 
    <link rel="stylesheet" href="{{ asset('css/main.css') }}" /> # Stocké dans app/Resources/public/css/main.css
    <link rel="stylesheet" href="{{ asset('bundles/lptest/css/main.css') }}" /> # Stocké dans src/Lp/TestBundle/Resources/Public/css/main.css


### Assetic

Assetic se basant sur Asset est un Bundle Symfony Framework afin de gérer les fichiers static en les filtrants, comme :
 
* Compilé LESS / SAAS / CoffeeScript
* Minifiier / Combiné
* Optimisation d'images

[<span class="btn btn-info">+ informations</span>](http://symfony.com/doc/current/cookbook/assetic/asset_management.html)

# Tests fonctionnels

Symfony intègre un librairie de test unitaire [PHPUnit](https://phpunit.de/manual/current/en/).

## Installation

    $ wget https://phar.phpunit.de/phpunit.phar # version 5.0 si php > 5.6 sinon phpunit-4.8.9.phar
    $ chmod +x phpunit.phar
    $ mv phpunit.phar ~/bin/phpunit
    $ phpunit --version

Les Tests fonctionnels sont là afin tester les différentes couche de votre application du routing jusqu'à la vue :

* Faire un requête
* Tester la réponse

Pour cela, nous allons écrire des classes afin de simuler des actions / calculs et nous tracer / tester ([assertX)](https://phpunit.de/manual/4.8/en/appendixes.assertions.html)) les 
résultats afin de faire remonter d'éventuelles erreurs.

## Ecrire un test

Lançons le test `DemoController` :

    phpunit -c app src/Lp/TestBundle/Tests/Controller/DemoControllerTest.php 
    
*`-c app` est une option de configuration afin d'aller checher les class de test (fichier / dossier)*

Avec la class `DemoControllerTest` :

    <?php
    
    namespace Lp\TestBundle\Tests\Controller;
    
    use Symfony\Bundle\FrameworkBundle\Test\WebTestCase; # class étendue PHPUnit_Framework_TestCase
    
    class DemoControllerTest extends WebTestCase
    {
        public function testIndex()
        {
            $client = static::createClient();
    
            $crawler = $client->request('GET', '/index');
        }
    
        public function testWhatsmyname()
        {
            $client = static::createClient();
    
            $crawler = $client->request('GET', '/whats-my-name/geoffroy');
            
            $this->assertTrue(200 === $client->getResponse()->getStatusCode()); # second argument peut-être un message
        }
    
    }
    
***Pour faire une démonstration, changer le routing de l'une des actions testées.***
    
[<span class="btn btn-info">+ informations</span>](http://symfony.com/doc/current/book/testing.html)

# Doctrine

## Introduction 

Cette librairie intégré dans la version full-stack de Symfony2 est ORM (Object Relationship Management). Un ORM permet 
de travailler dans le monde Object de PHP avec une Base de donnée. Concrètement, une table en base de donnée sera 
matérialisé par Doctrine par un Objet mappé que l'on appelle entité.

Afin d'appréhender cette notion, l'objectif est de créer un objet Page contenant les propriétés suivantes :

* Titre de page (pageTitle)
* Titre de menu (pageMenu)
* Chapeau (excerpt)
* Contenu (content)

Afin de connecter l'application via PDO à la base de donnée il faut renseigner les paramètres de connexion dans 
`app/config/parameters.yml`

## Mise en place

Il faut créer une class Page que l'on va déclarer en tant qu'entité grâce au mapping (dans notre cas on choisi 
le type de configuration en annotation). Le mapping se fait grâce à l'objet `Doctrine\ORM\Mapping` :

    <?php
    
    namespace Lp\TestBundle\Entity;
    
    use Doctrine\ORM\Mapping as ORM;
    
    /**
     * Page
     *
     * @ORM\Table()
     * @ORM\Entity # annotation qui permet de déclarer cette object en tant qu'entity
     */
    class Page
    {}

A cette classe, nous allons ajouter des proprités que l'on va mapper :

        /**
         * @var integer
         *
         * @ORM\Column(name="id", type="integer")
         * @ORM\Id
         * @ORM\GeneratedValue(strategy="AUTO")
         */
        private $id;
    
        /**
         * @var string
         *
         * @ORM\Column(name="page_title", type="string", length=255)
         */
        private $pageTitle;
    
        /**
         * @var string
         *
         * @ORM\Column(name="page_menu", type="string", length=255)
         */
        private $pageMenu;
    
        /**
         * @var string
         *
         * @ORM\Column(name="excerpt", type="text")
         */
        private $excerpt;
    
        /**
         * @var string
         *
         * @ORM\Column(name="content", type="text")
         */
        private $content;
        
        
Afin d'accéder à ces propriétés défniies il nous faut des setter et des getters qud l'on peut générer grâce à une ligne 
de commande :

```
$ app/console doctrine:generate:entities Lp/testBundleEntity/Page
```


        /**
         * Get id
         *
         * @return integer
         */
        public function getId()
        {
            return $this->id;
        }
    
        /**
         * Set pageTitle
         *
         * @param string $pageTitle
         *
         * @return Page
         */
        public function setPageTitle($pageTitle)
        {
            $this->pageTitle = $pageTitle;
    
            return $this;
        }
    
        /**
         * Get pageTitle
         *
         * @return string
         */
        public function getPageTitle()
        {
            return $this->pageTitle;
        }
    
        /**
         * Set pageMenu
         *
         * @param string $pageMenu
         *
         * @return Page
         */
        public function setPageMenu($pageMenu)
        {
            $this->pageMenu = $pageMenu;
    
            return $this;
        }
    
        /**
         * Get pageMenu
         *
         * @return string
         */
        public function getPageMenu()
        {
            return $this->pageMenu;
        }
    
        /**
         * Set excerpt
         *
         * @param string $excerpt
         *
         * @return Page
         */
        public function setExcerpt($excerpt)
        {
            $this->excerpt = $excerpt;
    
            return $this;
        }
    
        /**
         * Get excerpt
         *
         * @return string
         */
        public function getExcerpt()
        {
            return $this->excerpt;
        }
    
        /**
         * Set content
         *
         * @param string $content
         *
         * @return Page
         */
        public function setContent($content)
        {
            $this->content = $content;
    
            return $this;
        }
    
        /**
         * Get content
         *
         * @return string
         */
        public function getContent()
        {
            return $this->content;
        }
        

Biensûr, il existe une commande qui permet de générer cet type de class :

    $ app/console doctrine:generate:entity

Afin de générer un skeleton d'entité, il est demandé de la caractériser :

* Dans quel Bundle (ShortcutBundle:Entity `LpTestBundle:Page`
* Création des propriétés (champs)

[<span class="btn btn-info">+ informations sur le mapping</span>](http://docs.doctrine-project.org/projects/doctrine-orm/en/latest/reference/basic-mapping.html)

## Générer et mettre à jour la base de donnée

On peut créer la base de donnée directement en ligne de commande :

    $ app/console doctrine:database:create
    
Quans on crée une nouvelle entité ou qu'on met à jour une entité il faut synchroniser notre base de donnée. Cela s'
effectue par un simple ligne de commande :
    
    $ app/console doctrine:schema:update --force|--dump-sql

## Persister nos objets

Créer une nouvelle classe controller que l'on nomme `PageController`

Dans celle-ci nous créons une action `createAction` :

    // ...
    use Lp\TestBundle\Entity\Page;
    use Symfony\Component\HttpFoundation\Response;

    // ...
    public function createAction()
    {
        $page = new Page; # Création d'un nouvel objet Page
        $page->setPageTitle('Page title #1'); # assignation du titre de page
        $page->setPageMenu('Page #1'); # assignation ...
        $page->setExcerpt('Lorem ipsum dolor sit amet, consectetur adipiscing elit[...] '); # assignation ...
        $page->setContent('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam vulputate magna ac mi bibendum, nec varius augue mattis. Vestibulum cursus magna vestibulum, fringilla magna in, lobortis risus. ');

        $em = $this->getDoctrine()->getManager(); # Récupération de l'Entity Manager de Doctrine qui gère tous les process de l'ORM
    
        $em->persist($page); # on persiste (management de l'enregistrement)
        $em->flush(); # on flush => on éxécute les requêtes persistées auparavant
    
        return new Response('Created page id '.$page->getId());
    
    }
    
Créer au moins 5 pages en base de données.

## Récupération des objects

Afin d'effectuer des requêtes simple pour gérer la récupération d'objet :

    public function showAction($id)
    {
        $page = $this->getDoctrine()
            ->getRepository('LpTestBundle:Page') # récupère l'objet qui représente la table page 
            ->find($id); # méthode "trouve le record ayant l'id
    
        if (!$page) {
            throw $this->createNotFoundException(
                'No page found for id '.$id
            );
        }
    
        // on peut passer l'objet $page à notre template par exemple
        return [
            'page' => $page
         ]
    }
    
Afficher les informations de la page ayant l'id `$id`

## Mettre à jour un objet 

    public function updateAction($id)
    {
        $em = $this->getDoctrine()->getManager();
        $page = $em->getRepository('LpTestBundle:Page')->find($id);
    
        if (!$page) {
            throw $this->createNotFoundException(
                'No page found for id '.$id
            );
        }
    
        $page->setContent('New content!'); # mise à jour de la propriété
        $em->flush();
    
        return $this->redirectToRoute('homepage');
    }
    
## Récupérer plusieurs objets
 
### grâce à une DQL (Doctrine Query Language)

    $em = $this->getDoctrine()->getManager();
    $query = $em->createQuery(
        'SELECT p
        FROM LpTestBundle:Page p
        ORDER BY p.id DESC'
    );
    
    $pages = $query->getResult();
    
### grâce au queryBuilder

    $repository = $this->getDoctrine()
        ->getRepository('LpTestBundle:Page');
    
    // createQueryBuilder automatically selects FROM LpTestBundle:Page
    // and aliases it to "p"
    $query = $repository->createQueryBuilder('p')
        ->orderBy('p.id', 'DESC')
        ->getQuery();
    
    $page = $query->getResult();
    
# Gestion des Formulaires

## Simple form

A partir d'un controller, on peut créer un simple formulaire basé ou non sur sur un objet.


    namespace Lp\TestBundle\Controller;

    use Lp\TestBundle\Entity\Page;
    use Symfony\Bundle\FrameworkBundle\Controller\Controller;
    use Symfony\Component\HttpFoundation\Request;
    
    class PageController extends Controller
    {
        public function newAction(Request $request)
        {
            // create a page and give it some dummy data for this example
            $page = new Page();
            $page->setTitle('Write a blog post');
            $page->setContent('Lorem lipsum');
    
            $form = $this->createFormBuilder($page) // FormBuilderInterface
                ->add('title', 'text')
                ->add('content', 'textarea')
                ->add('save', 'submit', array('label' => 'Create Page'))
                ->getForm();
    
            return $this->render('page/new.html.twig', array(
                'form' => $form->createView(), // FormView
            ));
        }
    }

Afin d'afficher le rendu, il existe des fonctions twig :

    {# Lp/TestBundle/Resources/views/page/new.html.twig #}
    
    {{ form_start(form) }} # Ouverture du tag <form> avec les attr
    {{ form_widget(form) }} # Tous les champs dispo (widget)
    {{ form_end(form) }} # Fermeture du tag + les hidden + les crsf token

De plus, le system est suffisament intelligent afin de peupler les champs (`title` = `getTitle`)

## Gérer la soumission

    namespace Lp\TestBundle\Controller;

    use Lp\TestBundle\Entity\Page;
    use Symfony\Bundle\FrameworkBundle\Controller\Controller;
    use Symfony\Component\HttpFoundation\Request;
    
    class PageController extends Controller
    {
        public function newAction(Request $request)
        {
            // create a page and give it some dummy data for this example
            $page = new Page();
    
            $form = $this->createFormBuilder($page) // FormBuilderInterface
                ->add('title', 'text')
                ->add('content', 'textarea')
                ->add('save', 'submit', array('label' => 'Create Page'))
                ->getForm();
            
            $form->handleRequest($request);
            
            if ($form->isSubmitted() && $form->isValid()) {
                // ... perform some action, such as saving the page to the database
            
                return $this->redirectToRoute('page_success');
            }

            return $this->render('page/new.html.twig', array(
                'form' => $form->createView(), // FormView
            ));
        }
    }

## Formulaire comme un service

Afin de réutiliser ce formulaire dans plusieurs, différentes actions, les bonnes pratiques nous conseille d'isoler 
la définition de ce formualaire :

    // src/Lp/TestBundle/Form/Type/PageType.php
    namespace LpTestBundle\Form\Type;
    
    use Symfony\Component\Form\AbstractType;
    use Symfony\Component\Form\FormBuilderInterface;
    
    class PageType extends AbstractType
    {
        public function buildForm(FormBuilderInterface $builder, array $options)
        {
            $builder
                ->add('title', 'text')
                ->add('content', 'textarea')
                ->add('save', 'submit', array('label' => 'Create Page'))
            ;
        }
    
        public function getName()
        {
            return 'app_page';
        }
    }
    
Ensuite d'appeller cette classe dans nos différents controller :

    public function editAction()
    {
        $form = $this->createForm(new PageType(), $page);
    }
    
ou en le définissant en tant que service
    
    # src/Lp/TestBundle/Resources/config/services.yml
    services:
        app.form.type.page:
            class: LpTestBundle\Form\Type\PageType
            tags:
                - { name: form.type, alias: app_page }
                
    public function editAction()
    {
        $form = $this->createForm('app_page', $page);
    }

## Lier à un formulaire à une entity

Dans le cas d'une entité lié à un formulaire, il faut le déclarer dans la configuration du formulaire. Cela se révélera 
trés pratique dans le mapping / hydratation

    use Symfony\Component\OptionsResolver\OptionsResolver;
    
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'LpTestBundle\Entity\Page',
        ));
    }

## Bonne pratique 

Tout comme il est préférable de créer une classe de formulaire afin de réutiliser et de le maintenir, il est conseillé d'
 isoler le process d'éxécution, que on appellera un Handler
 
[<span class="btn btn-info">+ informations</span>](https://openclassrooms.com/courses/developpez-vos-applications-web-avec-symfony2/vos-premiers-pas-avec-les-formulaires#/id/r-1525418)

## Rendu / templating

Afin d'effectuer le rendu dans un template avec le moteur twig d'un formulaire il existe un certain nombre d'helper, 
fourni par le composant Symfony/Form

    {# Lp/TestBundle/Resources/views/page/new.html.twig #}
    {{ form_start(form) }}
        {{ form_errors(form) }}
    
        {{ form_row(form.title) }}
        {{ form_row(form.content) }}
    {{ form_end(form) }}


[<span class="btn btn-info">+ informations</span>](http://symfony.com/doc/current/reference/forms/twig_reference.html)

## Form Theming

Chaque élément composant le formulaire (label, input, ligne, etc...) peut-être thématisé en incluant des blocks 
définissant ces éléments.

Par exemple afin de thémer un `form_row()` :

    {% block form_row %}
    {% spaceless %}
        <div class="form_row">
            {{ form_label(form) }}
            {{ form_errors(form) }}
            {{ form_widget(form) }}
        </div>
    {% endspaceless %}
    {% endblock form_row %}
    
Ces blocks de défnition de thème peuvent être importé de manière suivante :
 
`{% form_theme form 'form/fields.html.twig' %}`

[<span class="btn btn-info">+ informations</span>](http://symfony.com/doc/current/book/forms.html#form-theming)
    
# Validation des données

Il est obligatoire de controller la pertinence des données soumises soit par un formulaire ou soit par une API ou autre 
canal..

Il existe un composant Symfony/Validator afin d'ajouter des contraintes à des entités par exemple 
et un certain nombre de class afin de gérer les processus.

## Par annotation sur des entités 

Pour l'exemple, nous allons partir de l'entité `Page` a laquelle nous allons ajouter des contraintes en annotation.
Nous allons rendre obligatoire les données sur `pageMenu` et `pageTitle` :

    
    use Symfony\Component\Validator\Constraints as Assert;  
    
    /**
     * @ORM\Table()
     * @ORM\Entity
     */
    class Page
    {
    
        /**
         * @var string
         *
         * @ORM\Column(name="page_title", type="string", length=255)
         * @Assert\NotBlank()
         */
        private $pageTitle;
    
        /**
         * @var string
         *
         * @ORM\Column(name="page_menu", type="string", length=255)
         * @Assert\NotBlank()
         */
        private $pageMenu;
        
    }

### Utiliser le service de validation dans une action


    // create a page and give it some dummy data for this example
    $page = new Page();
    $page->setPageTitle('Lorem lipsum 'title);
    $page->setPageMenu('Lorem lipsum');

    $validator = $this->get('validator');
    $errors = $validator->validate($page);

    if (count($errors) > 0) {
        /*
         * Uses a __toString method on the $errors variable which is a
         * ConstraintViolationList object. This gives us a nice string
         * for debugging.
         */
        $errorsString = (string) $errors;

        return new Response($errorsString);
    }

    return new Response('The page is valid! Yes!');
    
 ## Utiliser le service afin de valider un formulaire lié à une entité
 
 

