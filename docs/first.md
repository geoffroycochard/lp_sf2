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

Et pour créer une action, il suffit d'écrire une méthode dans cette classe annotée

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
    
    public function indexAction($Request $request)
    {
        $page = $request->query->get('page', 1);
    
        // ...
    }

[+ informations](http://symfony.com/doc/current/book/controller.html)

# Gestion du templating

Le templating dans le framework Symfony est géré par défault avec Twig. 

Que ce soit au niveau App ou Bundle, tous les templates se localisent dans `Resources/views`.

Faire évoluer le layout en intégrant le [starter template bootstrap](https://getbootstrap.com/examples/starter-template/) en mappant 
les zones dynamiques suivantes (block):

* title - balise title
* stylesheets - import des JS
* body - corps balise body
* javascripts - import des JS

[+ informations](http://twig.sensiolabs.org/)

## Lien 

Dans le layout, mettre en place un menu avec les 2 actions définies dans la class DemoController

Afin de récupérer l'url d'une action il suffit d'utiliser le helper twig spécialement fait pour Symfony2 `path()`, 
qui prend comme premier argument le nom de la route et en second, un tableau `{}` qui représente les paramètres. 

    <a href="{{ path('_index') }}">Go to index</a>

[+ informations](http://symfony.com/doc/current/book/templating.html#linking-to-pages)

## Assetic

http://symfony.com/doc/current/cookbook/assetic/asset_management.html


# Doctrine

# Form






