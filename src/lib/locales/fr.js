/**
 * IMPORTANT: These strings are not ready for localization. DO NOT TRANSLATE THIS FILE.
 * @see https://github.com/sveltia/sveltia-cms/blob/main/src/lib/locales/README.md
 */
export const strings = {
  // Pages & Navigation
  collections: '(Collections)',
  contents: '(Contenus)',
  entries: '(Entrées)',
  files: '(Fichiers)',
  assets: '(Ressources)',
  media: '(Médias)',
  workflow: '(Flux de travail)',
  editorial_workflow: '(Flux éditorial)',
  menu: '(Menu)',

  // Account
  user_name: "(Nom d'utilisateur)",
  password: '(Mot de passe)',
  sign_in: '(Se connecter)',
  sign_in_with_mobile: '(Se connecter avec un mobile)',
  sign_in_with_mobile_instruction:
    '(Scannez le code QR ci-dessous avec votre téléphone ou tablette pour une connexion sans mot de passe. Vos paramètres seront automatiquement copiés.)',
  signed_in_as_x: '(Connecté en tant que {name})',
  working_with_local_repo: '(Travail avec un dépôt local)',
  working_with_test_repo: '(Travail avec un dépôt de test)',
  sign_out: '(Se déconnecter)',

  // Common terms
  create: '(Nouveau)',
  select: '(Sélectionner)',
  select_all: '(Tout sélectionner)',
  upload: '(Téléverser)',
  copy: '(Copier)',
  download: '(Télécharger)',
  duplicate: '(Dupliquer)',
  delete: '(Supprimer)',
  save: '(Enregistrer)',
  saving: '(Enregistrement…)',
  rename: '(Renommer)',
  update: '(Mettre à jour)',
  replace: '(Remplacer)',
  add: '(Ajouter)',
  remove: '(Retirer)',
  remove_x: '(Retirer {name})',
  clear: '(Effacer)',
  expand: '(Développer)',
  expand_all: '(Tout développer)',
  collapse: '(Réduire)',
  collapse_all: '(Tout réduire)',
  insert: '(Insérer)',
  restore: '(Restaurer)',
  discard: '(Ignorer)',
  searching: '(Recherche…)',
  no_results: '(Aucun résultat trouvé.)',
  global: '(Global)',
  primary: '(Principal)',
  secondary: '(Secondaire)',
  collection: '(Collection)',
  folder: '(Dossier)',
  api_key: '(Clé API)',
  details: '(Détails)',
  back: '(Retour)',
  loading: '(Chargement…)',
  later: '(Plus tard)',
  slug: '(Identifiant)',
  singleton: '(Singleton)',
  singletons: '(Singletons)',

  // Common errors
  clipboard_error: "(Une erreur s'est produite lors de la copie des données.)",

  // Entrance
  welcome_message: '(Bienvenue sur {name})',
  powered_by: '(Propulsé par {name})',
  loading_cms_config: '(Chargement de la configuration CMS…)',
  loading_site_data: '(Chargement des données du site…)',
  loading_site_data_error: "(Une erreur s'est produite lors du chargement des données du site.)",
  sign_in_with_x: '(Se connecter avec {service})',
  sign_in_with_x_using_token: '(Se connecter avec {service} via un jeton)',
  sign_in_using_pat_title: "(Se connecter avec un jeton d'accès personnel)",
  sign_in_using_pat_description:
    '(Entrez votre jeton ci-dessous. Il doit avoir un accès en lecture/écriture au contenu du dépôt.)',
  sign_in_using_pat_link:
    '(Vous pouvez générer un jeton sur la <a>page des paramètres utilisateur {service}</a>.)',
  personal_access_token: "(Jeton d'accès personnel)",
  authorizing: '(Autorisation…)',
  signing_in: '(Connexion…)',
  work_with_local_repo: '(Travailler avec un dépôt local)',
  work_with_local_repo_description:
    '(Lorsque vous y êtes invité, sélectionnez le répertoire racine du dépôt « {repo} ».)',
  work_with_local_repo_description_no_repo:
    '(Lorsque vous y êtes invité, sélectionnez le répertoire racine de votre dépôt Git.)',
  work_with_test_repo: '(Travailler avec un dépôt de test)',
  sign_in_error: {
    not_project_root:
      "(Le dossier sélectionné n'est pas un répertoire racine de dépôt. Veuillez réessayer.)",
    picker_dismissed:
      '(Impossible de sélectionner un répertoire racine de dépôt. Veuillez réessayer.)',
    authentication_aborted: '(Authentification annulée. Veuillez réessayer.)',
    invalid_token: '(Le jeton fourni est invalide. Veuillez vérifier et réessayer.)',
    UNSUPPORTED_BACKEND: "(Votre backend Git n'est pas pris en charge par l'authentificateur.)",
    UNSUPPORTED_DOMAIN: "(Votre domaine n'est pas autorisé à utiliser l'authentificateur.)",
    MISCONFIGURED_CLIENT:
      "(L'identifiant client ou le secret de l'application OAuth n'est pas configuré.)",
    AUTH_CODE_REQUEST_FAILED:
      "(Échec de la réception d'un code d'autorisation. Veuillez réessayer plus tard.)",
    CSRF_DETECTED: "(Attaque CSRF potentielle détectée. Flux d'authentification interrompu.)",
    TOKEN_REQUEST_FAILED: "(Échec de la demande d'un jeton d'accès. Veuillez réessayer plus tard.)",
    TOKEN_REFRESH_FAILED:
      "(Échec du renouvellement du jeton d'accès. Veuillez réessayer plus tard.)",
    MALFORMED_RESPONSE:
      '(Le serveur a répondu avec des données malformées. Veuillez réessayer plus tard.)',
  },
  backend_unsupported_version:
    '(Le backend {name} nécessite {name} {version} ou une version ultérieure.)',
  repository_no_access: "(Vous n'avez pas accès au dépôt « {repo} ».)",
  repository_not_found: "(Le dépôt « {repo} » n'existe pas.)",
  repository_empty: "(Le dépôt « {repo} » n'a aucune branche.)",
  branch_not_found: '(Le dépôt « {repo} » ne possède pas la branche « {branch} ».)',
  unexpected_error: '(Erreur inattendue)',

  // Parser errors
  entry_parse_error:
    "(Une erreur s'est produite lors de l'analyse d'un fichier d'entrée. Consultez la console du navigateur pour plus de détails.)",
  entry_parse_errors:
    "(Des erreurs se sont produites lors de l'analyse de fichiers d'entrée. Consultez la console du navigateur pour plus de détails.)",

  // Onboarding
  mobile_promo_title: '(Sveltia CMS est maintenant disponible sur mobile !)',
  mobile_promo_button: '(Essayer)',

  // Global toolbar
  visit_live_site: '(Visiter le site en ligne)',
  switch_page: '(Changer de page)',
  search_placeholder_entries: '(Rechercher des entrées…)',
  search_placeholder_assets: '(Rechercher des ressources…)',
  search_placeholder_all: '(Rechercher des entrées et des ressources…)',
  create_entry_or_assets: '(Créer une entrée ou des ressources)',
  publish_changes: '(Publier les modifications)',
  publishing_changes: '(Publication des modifications…)',
  publishing_changes_failed:
    "(Les modifications n'ont pas pu être publiées. Veuillez réessayer plus tard.)",
  show_notifications: '(Afficher les notifications)',
  notifications: '(Notifications)',
  show_account_menu: '(Afficher le menu du compte)',
  account: '(Compte)',
  live_site: '(Site en ligne)',
  git_repository: '(Dépôt Git)',
  settings: '(Paramètres)',
  cms_config: '(Configuration CMS)',
  show_help_menu: "(Afficher le menu d'aide)",
  help: '(Aide)',
  keyboard_shortcuts: '(Raccourcis clavier)',
  documentation: '(Documentation)',
  release_notes: '(Notes de version)',
  announcements: '(Annonces)',
  version_x: '(Version {version})',
  report_issue: '(Signaler un problème)',
  share_feedback: '(Partager vos retours)',
  get_help: "(Obtenir de l'aide)",
  join_discord: '(Nous rejoindre sur Discord)',
  bluesky: '(Nous suivre sur Bluesky)',

  // Update notification
  update_available: '(La dernière version de Sveltia CMS est disponible.)',
  update_now: '(Mettre à jour maintenant)',

  // Backend status indicator
  backend_status: {
    minor_incident:
      '({service} rencontre un incident mineur. Votre flux de travail pourrait être affecté.)',
    major_incident:
      "({service} rencontre un incident majeur. Vous pourriez vouloir attendre que la situation s'améliore.)",
  },

  // Library
  content_library: '(Bibliothèque de contenus)',
  asset_library: '(Bibliothèque de ressources)',
  asset_location: {
    repository: '(Votre site)',
    external: '(Emplacements externes)',
    stock_photos: '(Photos de stock)',
  },
  collection_assets: '(Ressources de la collection)',
  entry_list: '(Liste des entrées)',
  file_list: '(Liste des fichiers)',
  asset_list: '(Liste des ressources)',
  x_collection: '(Collection « {collection} »)',
  x_asset_folder: '(Dossier de ressources « {folder} »)',
  viewing_collection_list: '(Vous consultez actuellement la liste des collections.)',
  viewing_asset_folder_list: '(Vous consultez actuellement la liste des dossiers de ressources.)',
  viewing_x_collection_many_entries:
    '(Vous consultez actuellement la collection « {collection} », qui contient {count} entrées.)',
  viewing_x_collection_one_entry:
    '(Vous consultez actuellement la collection « {collection} », qui contient une entrée.)',
  viewing_x_collection_no_entries:
    '(Vous consultez actuellement la collection « {collection} », qui ne contient encore aucune entrée.)',
  viewing_x_asset_folder_many_assets:
    '(Vous consultez actuellement le dossier de ressources « {folder} », qui contient {count} ressources.)',
  viewing_x_asset_folder_one_asset:
    '(Vous consultez actuellement le dossier de ressources « {folder} », qui contient une ressource.)',
  viewing_x_asset_folder_no_assets:
    '(Vous consultez actuellement le dossier de ressources « {folder} », qui ne contient encore aucune ressource.)',
  singleton_selected_announcement: '(Appuyez sur Entrée pour modifier le fichier « {file} ».)',
  collection_not_found: '(Collection introuvable)',
  file_not_found: '(Fichier introuvable.)',
  x_of_x_selected: '({selected} sur {total} sélectionné(s))',
  switch_view: '(Changer de vue)',
  list_view: '(Vue en liste)',
  grid_view: '(Vue en grille)',
  switch_to_list_view: '(Passer à la vue en liste)',
  switch_to_grid_view: '(Passer à la vue en grille)',
  sort: '(Trier)',
  sorting_options: '(Options de tri)',
  sort_keys: {
    none: '(Aucun)',
    name: '(Nom)',
    slug: '(Identifiant)',
    commit_author: '(Mis à jour par)',
    commit_date: '(Mis à jour le)',
  },
  ascending: '({label}, A à Z)',
  ascending_date: '({label}, du plus ancien au plus récent)',
  descending: '({label}, Z à A)',
  descending_date: '({label}, du plus récent au plus ancien)',
  filter: '(Filtrer)',
  filtering_options: '(Options de filtrage)',
  group: '(Grouper)',
  grouping_options: '(Options de regroupement)',
  type: '(Type)',
  all: '(Tous)',
  image: '(Image)',
  video: '(Vidéo)',
  audio: '(Audio)',
  document: '(Document)',
  other: '(Autre)',
  show_assets: '(Afficher les ressources)',
  hide_assets: '(Masquer les ressources)',
  show_info: '(Afficher les informations)',
  hide_info: '(Masquer les informations)',
  all_assets: '(Toutes les ressources)',
  global_assets: '(Ressources globales)',
  entry_not_found: '(Entrée introuvable.)',
  creating_entries_disabled_by_admin:
    "(La création de nouvelles entrées dans cette collection est désactivée par l'administrateur.)",
  creating_entries_disabled_by_quota:
    '(Vous ne pouvez pas ajouter de nouvelles entrées à cette collection car elle a atteint sa limite de {quota} entrées.)',
  creating_entries_nearing_quota_singular:
    '(Cette collection approche de sa limite de {quota} entrées. Vous ne pouvez créer que {remaining} entrée supplémentaire.)',
  creating_entries_nearing_quota_plural:
    '(Cette collection approche de sa limite de {quota} entrées. Vous ne pouvez créer que {remaining} entrées supplémentaires.)',
  back_to_collection: '(Retour à la collection)',
  collection_list: '(Liste des collections)',
  back_to_collection_list: '(Retour à la liste des collections)',
  asset_folder_list: '(Liste des dossiers de ressources)',
  back_to_asset_folder_list: '(Retour à la liste des dossiers de ressources)',
  search_results: '(Résultats de recherche)',
  search_results_for_x: '(Résultats de recherche pour « {terms} »)',
  viewing_entry_search_results:
    '(Vous consultez actuellement les résultats de recherche pour « {terms} ». Nous avons trouvé {entries}.)',
  viewing_asset_search_results:
    '(Vous consultez actuellement les résultats de recherche pour « {terms} ». Nous avons trouvé {assets}.)',
  many_entries: '({count} entrées)',
  one_entry: '(une entrée)',
  no_entries: '(aucune entrée)',
  many_assets: '({count} ressources)',
  one_asset: '(une ressource)',
  no_assets: '(aucune ressource)',
  no_files_found: '(Aucun fichier trouvé.)',
  no_entries_found: '(Aucune entrée trouvée.)',
  upload_assets: '(Téléverser de nouvelles ressources)',
  edit_options: "(Options d'édition)",
  show_edit_options: "(Afficher les options d'édition)",
  edit_asset: '(Modifier la ressource)',
  edit_x: '(Modifier {name})',
  wrap_long_lines: '(Retour à la ligne automatique)',
  rename_asset: '(Renommer la ressource)',
  rename_x: '(Renommer {name})',
  enter_new_name_for_asset: '(Entrez un nouveau nom ci-dessous.)',
  enter_new_name_for_asset_with_one_entry:
    '(Entrez un nouveau nom ci-dessous. Une entrée utilisant la ressource sera également mise à jour.)',
  enter_new_name_for_asset_with_many_entries:
    '(Entrez un nouveau nom ci-dessous. {count} entrées utilisant la ressource seront également mises à jour.)',
  enter_new_name_for_asset_error: {
    empty: '(Le nom du fichier ne peut pas être vide.)',
    character: '(Le nom du fichier ne peut pas contenir de caractères spéciaux.)',
    duplicate: '(Ce nom de fichier est déjà utilisé par une autre ressource.)',
  },
  replace_asset: '(Remplacer la ressource)',
  replace_x: '(Remplacer {name})',
  click_to_browse: '(Cliquez pour parcourir…)',
  tap_to_browse: '(Appuyez pour parcourir…)',
  drop_file_or_click_to_browse: '(Déposez un fichier ici ou cliquez pour parcourir…)',
  drop_files_or_click_to_browse: '(Déposez des fichiers ici ou cliquez pour parcourir…)',
  drop_image_file_or_click_to_browse: '(Déposez un fichier image ici ou cliquez pour parcourir…)',
  drop_image_files_or_click_to_browse:
    '(Déposez des fichiers images ici ou cliquez pour parcourir…)',
  drop_file_here: '(Déposez un fichier ici)',
  drop_files_here: '(Déposez des fichiers ici)',
  unsupported_file_type: '(Type de fichier non pris en charge)',
  dropped_file_type_mismatch: "(Le fichier déposé n'est pas du type {type}. Veuillez réessayer.)",
  dropped_image_type_mismatch:
    "(Le fichier déposé n'est pas pris en charge. Seules les images AVIF, GIF, JPEG, PNG, WebP ou SVG sont acceptées. Veuillez réessayer.)",
  choose_file: '(Choisir un fichier)',
  choose_files: '(Choisir des fichiers)',
  delete_asset: '(Supprimer la ressource)',
  delete_assets: '(Supprimer les ressources)',
  delete_selected_asset: '(Supprimer la ressource sélectionnée)',
  delete_selected_assets: '(Supprimer les ressources sélectionnées)',
  confirm_deleting_this_asset: '(Êtes-vous sûr de vouloir supprimer cette ressource ?)',
  confirm_deleting_selected_asset:
    '(Êtes-vous sûr de vouloir supprimer la ressource sélectionnée ?)',
  confirm_deleting_selected_assets:
    '(Êtes-vous sûr de vouloir supprimer les {count} ressources sélectionnées ?)',
  confirm_deleting_all_assets: '(Êtes-vous sûr de vouloir supprimer toutes les ressources ?)',
  delete_entry: "(Supprimer l'entrée)",
  delete_entries: '(Supprimer les entrées)',
  delete_selected_entry: "(Supprimer l'entrée sélectionnée)",
  delete_selected_entries: '(Supprimer les entrées sélectionnées)',
  confirm_deleting_this_entry: '(Êtes-vous sûr de vouloir supprimer cette entrée ?)',
  confirm_deleting_this_entry_with_assets:
    '(Êtes-vous sûr de vouloir supprimer cette entrée et les ressources associées ?)',
  confirm_deleting_selected_entry: "(Êtes-vous sûr de vouloir supprimer l'entrée sélectionnée ?)",
  confirm_deleting_selected_entry_with_assets:
    "(Êtes-vous sûr de vouloir supprimer l'entrée sélectionnée et les ressources associées ?)",
  confirm_deleting_selected_entries:
    '(Êtes-vous sûr de vouloir supprimer les {count} entrées sélectionnées ?)',
  confirm_deleting_selected_entries_with_assets:
    '(Êtes-vous sûr de vouloir supprimer les {count} entrées sélectionnées et les ressources associées ?)',
  confirm_deleting_all_entries: '(Êtes-vous sûr de vouloir supprimer toutes les entrées ?)',
  confirm_deleting_all_entries_with_assets:
    '(Êtes-vous sûr de vouloir supprimer toutes les entrées et les ressources associées ?)',
  processing_file: "(Traitement d'un fichier en cours. Cela peut prendre un moment.)",
  processing_files: '(Traitement des fichiers en cours. Cela peut prendre un moment.)',
  uploading_files: '(Téléversement des fichiers)',
  confirm_replacing_file:
    '(Êtes-vous sûr de vouloir remplacer « {name} » par le fichier suivant ?)',
  confirm_uploading_file:
    '(Êtes-vous sûr de vouloir enregistrer le fichier suivant dans le dossier « {folder} » ?)',
  confirm_uploading_files:
    '(Êtes-vous sûr de vouloir enregistrer les {count} fichiers suivants dans le dossier « {folder} » ?)',
  oversized_files: '(Fichiers trop volumineux)',
  warning_oversized_file:
    '(Ce fichier ne peut pas être téléversé car il dépasse la taille maximale de {size}. Veuillez réduire la taille ou sélectionner un autre fichier.)',
  warning_oversized_files:
    "(Ces fichiers ne peuvent pas être téléversés car ils dépassent la taille maximale de {size}. Veuillez réduire les tailles ou sélectionner d'autres fichiers.)",
  uploading_files_progress: '(Téléversement des fichiers…)',
  uploading_file_progress: '(Téléversement du fichier…)',
  uploading_files_failed: "(Les fichiers n'ont pas pu être téléversés)",
  uploading_file_failed: "(Le fichier n'a pas pu être téléversé)",
  file_meta: '({type} · {size})',
  file_meta_converted_from_x: '((converti depuis {type}))',
  no_entries_created: '(Cette collection ne contient encore aucune entrée.)',
  create_new_entry: '(Créer une nouvelle entrée)',
  entry: '(Entrée)',
  index_file: '(Fichier index)',
  no_files_in_collection: '(Aucun fichier disponible dans cette collection.)',
  asset_info: '(Informations sur la ressource)',
  select_asset_show_info: '(Sélectionnez une ressource pour afficher ses informations.)',
  duplicate_entry: "(Dupliquer l'entrée)",
  entry_duplicated: "(L'entrée a été dupliquée. C'est maintenant un nouveau brouillon.)",
  entry_validation_error:
    "(Un champ contient une erreur. Veuillez la corriger pour enregistrer l'entrée.)",
  entry_validation_errors:
    "({count} champs contiennent des erreurs. Veuillez les corriger pour enregistrer l'entrée.)",
  entry_saved: "(L'entrée a été enregistrée.)",
  entry_saved_and_published: "(L'entrée a été enregistrée et publiée.)",
  entry_deleted: "(L'entrée a été supprimée.)",
  entries_deleted: '({count} entrées ont été supprimées.)',
  asset_saved: '(La ressource a été enregistrée.)',
  asset_saved_and_published: '(La ressource a été enregistrée et publiée.)',
  assets_saved: '({count} ressources ont été enregistrées.)',
  assets_saved_and_published: '({count} ressources ont été enregistrées et publiées.)',
  asset_url_copied: "(L'URL de la ressource a été copiée dans le presse-papiers.)",
  asset_urls_copied: '(Les URL des ressources ont été copiées dans le presse-papiers.)',
  asset_path_copied: '(Le chemin du fichier de la ressource a été copié dans le presse-papiers.)',
  asset_paths_copied:
    '(Les chemins des fichiers de ressources ont été copiés dans le presse-papiers.)',
  asset_data_copied: '(Le fichier de ressource a été copié dans le presse-papiers.)',
  asset_downloaded: '(Le fichier de ressource a été téléchargé.)',
  assets_downloaded: '(Les fichiers de ressources ont été téléchargés.)',
  asset_moved: '(La ressource a été déplacée.)',
  assets_moved: '({count} ressources ont été déplacées.)',
  asset_renamed: '(La ressource a été renommée.)',
  assets_renamed: '({count} ressources ont été renommées.)',
  asset_deleted: '(La ressource a été supprimée.)',
  assets_deleted: '({count} ressources ont été supprimées.)',

  // Content editor
  content_editor: '(Éditeur de contenu)',
  restore_backup_title: '(Restaurer le brouillon)',
  restore_backup_description:
    '(Cette entrée possède une sauvegarde du {datetime}. Souhaitez-vous restaurer le brouillon modifié ?)',
  draft_backup_saved: '(La sauvegarde du brouillon a été enregistrée.)',
  draft_backup_restored: '(La sauvegarde du brouillon a été restaurée.)',
  draft_backup_deleted: '(La sauvegarde du brouillon a été supprimée.)',
  cancel_editing: '(Annuler la modification)',
  create_entry_title: '(Création de {name})',
  create_entry_announcement:
    '(Vous créez actuellement une nouvelle entrée dans la collection « {collection} ».)',
  edit_entry_title: '({collection} › {entry})',
  edit_entry_announcement:
    "(Vous modifiez actuellement l'entrée « {entry} » dans la collection « {collection} ».)",
  edit_file_announcement:
    '(Vous modifiez actuellement le fichier « {file} » dans la collection « {collection} ».)',
  edit_singleton_announcement: '(Vous modifiez actuellement le fichier « {file} ».)',
  save_and_publish: '(Enregistrer et publier)',
  save_without_publishing: '(Enregistrer sans publier)',
  show_editor_options: "(Afficher les options de l'éditeur)",
  editor_options: "(Options de l'éditeur)",
  show_preview: "(Afficher l'aperçu)",
  sync_scrolling: '(Synchroniser le défilement)',
  switch_locale: '(Changer de langue)',
  locale_content_disabled_short: '((désactivé))',
  locale_content_error_short: '((erreur))',
  edit: '(Modifier)',
  preview: '(Aperçu)',
  edit_x_locale: '(Modifier le contenu en {locale})',
  preview_x_locale: '(Aperçu du contenu en {locale})',
  content_preview: '(Aperçu du contenu)',
  show_content_options_x_locale: '(Afficher les options de contenu en {locale})',
  content_options_x_locale: '(Options de contenu en {locale})',
  x_field: '(Champ « {field} »)',
  show_field_options: '(Afficher les options du champ)',
  field_options: '(Options du champ)',
  unsupported_field_type_x: '(Type de champ non pris en charge : {name})',
  enable_x_locale: '(Activer {locale})',
  reenable_x_locale: '(Réactiver {locale})',
  disable_x_locale: '(Désactiver {locale})',
  locale_x_has_been_disabled: '(Le contenu en {locale} a été désactivé.)',
  locale_x_now_disabled:
    "(Le contenu en {locale} est maintenant désactivé. Il sera supprimé lors de l'enregistrement de l'entrée.)",
  view_in_repository: '(Voir dans le dépôt)',
  view_on_x: '(Voir sur {service})',
  view_on_live_site: '(Voir sur le site en ligne)',
  copy_from: '(Copier depuis…)',
  copy_from_x: '(Copier depuis {locale})',
  translation_options: '(Options de traduction)',
  translate: '(Traduire)',
  translate_field: '(Traduire le champ)',
  translate_fields: '(Traduire les champs)',
  translate_from: '(Traduire depuis…)',
  translate_from_x: '(Traduire depuis {locale})',
  revert_changes: '(Annuler les modifications)',
  revert_all_changes: '(Annuler toutes les modifications)',
  insert_table: '(Insérer un tableau)',
  table_rows: '(Lignes)',
  table_cols: '(Colonnes)',
  edit_slug: "(Modifier l'identifiant)",
  edit_slug_warning:
    "(Modifier l'identifiant peut rompre les liens internes et externes vers l'entrée. Actuellement, Sveltia CMS ne met pas à jour les références créées avec les champs Relation, vous devrez donc mettre à jour manuellement ces références ainsi que les autres liens.)",
  edit_slug_error: {
    empty: "(L'identifiant ne peut pas être vide.)",
    duplicate: '(Cet identifiant est déjà utilisé par une autre entrée.)',
  },
  required: '(Requis)',
  editor: {
    translation: {
      none: "(Rien n'a été traduit.)",
      started: '(Traduction…)',
      error: "(Une erreur s'est produite lors de la traduction.)",
      complete: {
        one: '(Le champ a été traduit depuis {source}.)',
        many: '({count} champs ont été traduits depuis {source}.)',
      },
    },
    copy: {
      none: "(Rien n'a été copié.)",
      complete: {
        one: '(Le champ a été copié depuis {source}.)',
        many: '({count} champs ont été copiés depuis {source}.)',
      },
    },
  },
  validation: {
    value_missing: '(Ce champ est requis.)',
    range_underflow: {
      'datetime-local': '(La date/heure doit être égale ou postérieure à {min}.)',
      date: '(La date doit être égale ou postérieure au {min}.)',
      time: "(L'heure doit être égale ou postérieure à {min}.)",
      number: '(La valeur doit être supérieure ou égale à {min}.)',
      select_many: '(Vous devez sélectionner au moins {min} éléments.)',
      select_one: '(Vous devez sélectionner au moins {min} élément.)',
      add_many: '(Vous devez ajouter au moins {min} éléments.)',
      add_one: '(Vous devez ajouter au moins {min} élément.)',
    },
    range_overflow: {
      'datetime-local': '(La date/heure doit être égale ou antérieure à {max}.)',
      date: '(La date doit être égale ou antérieure au {max}.)',
      time: "(L'heure doit être égale ou antérieure à {max}.)",
      number: '(La valeur doit être inférieure ou égale à {max}.)',
      select_many: '(Vous ne pouvez pas sélectionner plus de {max} éléments.)',
      select_one: '(Vous ne pouvez pas sélectionner plus de {max} élément.)',
      add_many: '(Vous ne pouvez pas ajouter plus de {max} éléments.)',
      add_one: '(Vous ne pouvez pas ajouter plus de {max} élément.)',
    },
    too_short: {
      one: '(Vous devez saisir au moins {min} caractère.)',
      many: '(Vous devez saisir au moins {min} caractères.)',
    },
    too_long: {
      one: '(Vous ne pouvez pas saisir plus de {max} caractère.)',
      many: '(Vous ne pouvez pas saisir plus de {max} caractères.)',
    },
    type_mismatch: {
      number: '(Veuillez saisir un nombre.)',
      email: '(Veuillez saisir une adresse e-mail valide.)',
      url: '(Veuillez saisir une URL valide.)',
    },
  },
  saving_entry: {
    error: {
      title: '(Erreur)',
      description:
        "(Une erreur s'est produite lors de l'enregistrement de l'entrée. Veuillez réessayer plus tard.)",
    },
  },

  // Media details
  viewing_x_asset_details: '(Vous consultez les détails de la ressource « {name} ».)',
  asset_editor: '(Éditeur de ressources)',
  preview_unavailable: '(Aperçu indisponible.)',
  public_url: '(URL publique)',
  public_urls: '(URL publiques)',
  file_path: '(Chemin du fichier)',
  file_paths: '(Chemins des fichiers)',
  file_data: '(Données du fichier)',
  kind: '(Type)',
  size: '(Taille)',
  dimensions: '(Dimensions)',
  duration: '(Durée)',
  used_in: '(Utilisé dans)',
  created_date: '(Date de création)',
  location: '(Emplacement)',
  map_lat_lng: '(Carte affichant la latitude {latitude}, longitude {longitude})',

  // Fields
  select_file: '(Sélectionner un fichier)',
  select_image: '(Sélectionner une image)',
  replace_file: '(Remplacer le fichier)',
  replace_image: "(Remplacer l'image)",
  remove_file: '(Supprimer le fichier)',
  remove_image: "(Supprimer l'image)",
  remove_this_item: '(Supprimer cet élément)',
  move_up: '(Monter)',
  move_down: '(Descendre)',
  add_x: '(Ajouter {name})',
  add_item_above: '(Ajouter un élément au-dessus)',
  add_item_below: '(Ajouter un élément en dessous)',
  select_list_type: '(Sélectionner le type de liste)',
  opacity: '(Opacité)',
  unselected_option: '((Aucun))',
  assets_dialog: {
    title: {
      file: '(Sélectionner un fichier)',
      image: '(Sélectionner une image)',
    },
    search_for_file: '(Rechercher des fichiers)',
    search_for_image: '(Rechercher des images)',
    locations: '(Emplacements)',
    folder: {
      field: '(Ressources du champ)',
      entry: "(Ressources de l'entrée)",
      file: '(Ressources du fichier)',
      collection: '(Ressources de la collection)',
      global: '(Ressources globales)',
    },
    error: {
      invalid_key: '(Votre clé API est invalide ou expirée. Veuillez vérifier et réessayer.)',
      search_fetch_failed:
        "(Une erreur s'est produite lors de la recherche de ressources. Veuillez réessayer plus tard.)",
      image_fetch_failed:
        "(Une erreur s'est produite lors du téléchargement de la ressource sélectionnée. Veuillez réessayer plus tard.)",
    },
    available_images: '(Images disponibles)',
    enter_url: '(Entrer une URL)',
    enter_file_url: "(Entrez l'URL du fichier :)",
    enter_image_url: "(Entrez l'URL de l'image :)",
    large_file: {
      title: '(Fichier volumineux)',
    },
    photo_credit: {
      title: '(Crédit photo)',
      description: '(Utilisez le crédit suivant si possible :)',
    },
    unsaved: '(Non enregistré)',
  },
  character_counter: {
    min_max: {
      one: '({count} caractère saisi. Minimum : {min}. Maximum : {max}.)',
      many: '({count} caractères saisis. Minimum : {min}. Maximum : {max}.)',
    },
    min: {
      one: '({count} caractère saisi. Minimum : {min}.)',
      many: '({count} caractères saisis. Minimum : {min}.)',
    },
    max: {
      one: '({count} caractère saisi. Maximum : {max}.)',
      many: '({count} caractères saisis. Maximum : {max}.)',
    },
  },
  youtube_video_player: '(Lecteur vidéo YouTube)',
  today: "(Aujourd'hui)",
  now: '(Maintenant)',
  editor_components: {
    image: '(Image)',
    table: '(Tableau)',
    src: '(Source)',
    alt: '(Texte alternatif)',
    title: '(Titre)',
    link: '(Lien)',
  },
  key_value: {
    key: '(Clé)',
    value: '(Valeur)',
    action: '(Action)',
    empty_key: '(La clé est requise.)',
    duplicate_key: '(La clé doit être unique.)',
  },
  find_place: '(Trouver un lieu)',
  use_your_location: '(Utiliser votre position)',
  geolocation_error_title: '(Erreur de géolocalisation)',
  geolocation_error_body: "(Une erreur s'est produite lors de la récupération de votre position.)",
  geolocation_unsupported:
    "(L'API de géolocalisation n'est pas prise en charge par ce navigateur.)",

  // Content preview
  boolean: {
    true: '(Oui)',
    false: '(Non)',
  },

  // Integrations
  cloud_storage: {
    invalid: "(Le service n'est pas configuré correctement.)",
    auth: {
      api_key: {
        initial: '(Entrez votre clé API pour vous connecter à {service}.)',
        requested: '(Validation…)',
        error: '(La clé API fournie est invalide. Veuillez vérifier et réessayer.)',
      },
      password: {
        initial: '(Entrez votre mot de passe pour vous connecter à {service}.)',
        requested: '(Connexion…)',
        error: "(Nom d'utilisateur ou mot de passe incorrect. Veuillez vérifier et réessayer.)",
      },
    },
    cloudinary: {
      iframe_title: '(Bibliothèque de médias Cloudinary)',
      activate: {
        button_label: '(Activer Cloudinary)',
        description:
          '(Après vous être connecté, cliquez à nouveau sur le bouton Se connecter pour continuer.)',
      },
      auth: {
        initial: '(Entrez votre secret API pour utiliser Cloudinary.)',
        requested: '(Validation…)',
        error: '(Le secret API fourni est invalide. Veuillez vérifier et réessayer.)',
      },
    },
    uploadcare: {
      auth: {
        initial: '(Entrez votre clé secrète API pour utiliser Uploadcare.)',
        requested: '(Validation…)',
        error: '(La clé secrète fournie est invalide. Veuillez vérifier et réessayer.)',
      },
    },
  },

  // Configuration
  config: {
    one_error:
      '(Il y a une erreur dans la configuration CMS. Veuillez résoudre le problème et réessayer.)',
    many_errors:
      '(Il y a des erreurs dans la configuration CMS. Veuillez résoudre les problèmes et réessayer.)',
    error_locator: {
      collection: '(Collection {collection})',
      file: '(Fichier {file})',
      field: '(Champ `{field}`)',
    },
    error: {
      no_secure_context: '(Sveltia CMS fonctionne uniquement avec des URL HTTPS ou localhost.)',
      insecure_url:
        "(L'URL du fichier de configuration doit utiliser le protocole HTTPS ou une adresse localhost.)",
      insecure_urls:
        '(Les URL des fichiers de configuration doivent utiliser le protocole HTTPS ou des adresses localhost.)',
      fetch_failed: "(Le fichier de configuration n'a pas pu être récupéré.)",
      fetch_failed_not_ok: '(La réponse HTTP a renvoyé le statut {status}.)',
      fetch_failed_with_manual_init:
        "(Le fichier de configuration n'a pas pu être récupéré. Pour empêcher le chargement du fichier `config.yml`, ajoutez [`load_config_file: false`](https://sveltiacms.app/en/docs/api/initialization#providing-a-full-configuration) à l'objet de configuration passé à `CMS.init()`.)",
      parse_failed: "(Le fichier de configuration n'a pas pu être analysé.)",
      parse_failed_invalid_object:
        "(Le fichier de configuration n'est pas un objet JavaScript valide.)",
      parse_failed_unsupported_type:
        "(Le fichier de configuration n'est pas d'un type valide. Seuls YAML, TOML et JSON sont pris en charge.)",
      no_collection: "(Aucune collection n'est définie.)",
      missing_backend: "(Le backend n'est pas défini.)",
      missing_backend_name: "(Le nom du backend n'est pas défini.)",
      unsupported_known_backend:
        "(Le backend {name} n'est [pas pris en charge](https://sveltiacms.app/en/docs/migration/netlify-decap-cms#features-not-to-be-implemented) dans Sveltia CMS.)",
      unsupported_custom_backend:
        '(Les backends personnalisés ne sont [pas pris en charge](https://sveltiacms.app/en/docs/migration/netlify-decap-cms#features-not-to-be-implemented) dans Sveltia CMS.)',
      unsupported_backend_suggestion:
        "(Utilisez plutôt l'un des [backends pris en charge](https://sveltiacms.app/en/docs/backends#supported-backends).)",
      missing_repository: "(Le dépôt n'est pas défini.)",
      invalid_repository:
        '(Le dépôt configuré est invalide. Il doit être au format « propriétaire/dépôt ».)',
      oauth_implicit_flow:
        "(La méthode d'authentification configurée (flux implicite) n'est pas prise en charge dans Sveltia CMS. Utilisez l'autorisation PKCE à la place.)",
      github_pkce_unsupported:
        "(L'autorisation PKCE avec GitHub n'est pas encore prise en charge dans Sveltia CMS en raison des limitations de GitHub.)",
      oauth_no_app_id: "(L'identifiant de l'application OAuth n'est pas défini.)",
      missing_media_folder: "(Le dossier de médias n'est pas défini.)",
      invalid_media_folder:
        '(Le dossier de médias configuré est invalide. Il doit être une chaîne de caractères.)',
      invalid_public_folder:
        '(Le dossier public configuré est invalide. Il doit être une chaîne de caractères.)',
      public_folder_relative_path:
        '(Le dossier public configuré est invalide. Il doit être un chemin absolu commençant par « / ».)',
      public_folder_absolute_url:
        "(Une URL absolue pour l'option de dossier public n'est pas prise en charge dans Sveltia CMS.)",
      invalid_collection_no_options:
        "(La collection doit avoir l'option `folder`, `files` ou `divider` définie.)",
      invalid_collection_multiple_options:
        '(La collection ne peut pas avoir les options `folder`, `files` et `divider` ensemble.)',
      file_format_mismatch: "(L'extension `{extension}` ne correspond pas au format `{format}`.)",
      invalid_slug_slash:
        "(Le modèle d'identifiant `{slug}` est invalide car il ne peut pas contenir de barres obliques. Pour organiser les entrées dans des sous-dossiers, utilisez l'option `path` plutôt que `slug`.)",
      missing_collection_name:
        "(La collection {count} doit avoir l'option `name` définie comme une chaîne non vide.)",
      invalid_collection_name:
        '(Le nom de collection `{name}` est invalide. Il ne doit pas contenir de caractères spéciaux.)',
      duplicate_collection_name:
        "(Les noms de collection doivent être uniques, mais `{name}` est utilisé plus d'une fois.)",
      missing_collection_file_name:
        "(Le fichier de collection {count} doit avoir l'option `name` définie comme une chaîne non vide.)",
      invalid_collection_file_name:
        '(Le nom de fichier de collection `{name}` est invalide. Il ne doit pas contenir de caractères spéciaux.)',
      duplicate_collection_file_name:
        "(Les noms de fichiers de collection doivent être uniques, mais `{name}` est utilisé plus d'une fois.)",
      missing_field_name:
        "(Le champ {count} doit avoir l'option `name` définie comme une chaîne non vide.)",
      invalid_field_name:
        '(Le nom de champ `{name}` est invalide. Il ne doit pas contenir de caractères spéciaux.)',
      duplicate_field_name:
        "(Les noms de champs doivent être uniques, mais `{name}` est utilisé plus d'une fois.)",
      missing_variable_type:
        "(Le type de variable {count} doit avoir l'option `name` définie comme une chaîne non vide.)",
      invalid_variable_type:
        '(Le nom de type de variable `{name}` est invalide. Il ne doit pas contenir de caractères spéciaux.)',
      duplicate_variable_type:
        "(Les noms de types de variables doivent être uniques, mais `{name}` est utilisé plus d'une fois.)",
      date_field_type:
        "(Le type de champ Date déprécié n'est pas pris en charge dans Sveltia CMS. Utilisez le type de champ DateTime avec l'option `time_format:false` à la place.)",
      unsupported_deprecated_option:
        "(L'option dépréciée `{prop}` n'est pas prise en charge dans Sveltia CMS. Utilisez l'option `{newProp}` à la place.)",
      allow_multiple:
        "(L'option `allow_multiple` n'est pas prise en charge dans Sveltia CMS. Utilisez l'option `multiple` à la place, qui est à `false` par défaut.)",
      invalid_list_field:
        '(Le champ Liste ne peut pas avoir les options `field`, `fields` et `types` ensemble.)',
      invalid_list_variable_type:
        "(Le type de variable du champ Liste est invalide. L'option `widget` est définie sur `{widget}` mais elle doit être `object`.)",
      invalid_object_field:
        '(Le champ Objet ne peut pas avoir les options `fields` et `types` ensemble.)',
      object_field_missing_fields:
        "(Le champ Objet doit avoir l'option `fields` ou `types` définie.)",
      relation_field_invalid_collection:
        '(La collection référencée `{collection}` est invalide ou non définie.)',
      relation_field_invalid_collection_file:
        '(Le fichier référencé `{file}` est invalide ou non défini.)',
      relation_field_missing_file_name:
        "(L'option `file` doit être définie pour une relation avec une collection de fichiers.)",
      relation_field_invalid_value_field:
        '(Le champ de valeur référencé `{field}` est invalide ou non défini.)',
      unexpected: '(Erreur inattendue)',
    },
    warning: {
      editorial_workflow_unsupported:
        "(Le flux éditorial n'est pas encore pris en charge dans Sveltia CMS.)",
      open_authoring_unsupported:
        "(La création ouverte n'est pas encore prise en charge dans Sveltia CMS.)",
      nested_collections_unsupported:
        '(Les collections imbriquées ne sont pas encore prises en charge dans Sveltia CMS.)',
      unsupported_ignored_option:
        "(L'option `{prop}` n'est pas prise en charge dans Sveltia CMS. Elle sera ignorée.)",
    },
    compatibility_link:
      '(Consultez les notes de compatibilité pour plus de détails : https://sveltiacms.app/en/docs/migration/netlify-decap-cms#features-not-to-be-implemented)',
  },

  // Backends
  local_backend: {
    indicator: '(Local)',
    unsupported_browser:
      "(Le développement local n'est pas pris en charge par votre navigateur. Veuillez utiliser Chrome ou Edge à la place.)",
    disabled:
      "(Le développement local est désactivé dans votre navigateur. <a>Voici comment l'activer</a>.)",
  },

  // Editorial Workflow
  status: {
    drafts: '(Brouillons)',
    in_review: '(En révision)',
    ready: '(Prêt)',
  },

  // Settings
  categories: '(Catégories)',
  prefs: {
    changes: {
      api_key_saved: '(La clé API a été enregistrée.)',
      api_key_removed: '(La clé API a été supprimée.)',
    },
    error: {
      permission_denied:
        "(L'accès au stockage du navigateur (Cookie) a été refusé. Veuillez vérifier les permissions et réessayer.)",
    },
    appearance: {
      title: '(Apparence)',
      theme: '(Thème)',
      select_theme: '(Sélectionner un thème)',
    },
    theme: {
      auto: '(Automatique)',
      dark: '(Sombre)',
      light: '(Clair)',
    },
    language: {
      title: '(Langue)',
      ui_language: {
        title: "(Langue de l'interface utilisateur)",
        select_language: '(Sélectionner une langue)',
      },
    },
    contents: {
      title: '(Contenus)',
      editor: {
        title: '(Éditeur)',
        use_draft_backup: {
          switch_label: '(Sauvegarder automatiquement les brouillons)',
        },
        close_on_save: {
          switch_label: "(Fermer l'éditeur après l'enregistrement d'un brouillon)",
        },
        close_with_escape: {
          switch_label: "(Fermer l'éditeur avec la touche Échap)",
        },
      },
    },
    i18n: {
      title: '(Internationalisation)',
      translators: {
        default: {
          title: '(Service de traduction par défaut)',
          select_service: '(Sélectionner un service)',
        },
        api_keys: {
          title: '(Clés API des services de traduction)',
          description: '(Gérer les clés API pour les <a>services de traduction</a>.)',
        },
        field_label: '(Clé {service})',
        description:
          '(Inscrivez-vous sur <a {homeHref}>{service}</a> et entrez <a {apiKeyHref}>votre clé API</a> ici pour activer la traduction rapide des champs de texte.)',
      },
    },
    media: {
      title: '(Médias)',
      stock_photos: {
        api_keys: {
          title: '(Clés API des services de photos de stock)',
          description: '(Gérer les clés API pour les <a>services de photos de stock</a>.)',
        },
        field_label: '(Clé API {service})',
        description:
          "(Inscrivez-vous sur <a {homeHref}>{service} API</a> et entrez <a {apiKeyHref}>votre clé API</a> ici pour insérer des photos de stock gratuites dans les champs d'image.)",
        credit: '(Photos fournies par {service})',
      },
      cloud_storage: {
        api_keys: {
          title: '(Clés API des services de stockage en nuage)',
          description: '(Gérer les clés API pour les <a>services de stockage en nuage</a>.)',
        },
        field_label: '(Clé API {service})',
      },
      libraries_disabled:
        "(Les bibliothèques de médias externes sont désactivées par l'administrateur.)",
    },
    accessibility: {
      title: '(Accessibilité)',
      underline_links: {
        title: '(Souligner les liens)',
        description:
          "(Afficher le soulignement des liens dans l'aperçu des entrées et les étiquettes de l'interface.)",
        switch_label: '(Toujours souligner les liens)',
      },
    },
    advanced: {
      title: '(Avancé)',
      beta: {
        title: '(Fonctionnalités bêta)',
        description:
          '(Activer certaines fonctionnalités bêta qui peuvent être instables ou non localisées.)',
        switch_label: '(Rejoindre le programme bêta)',
      },
      developer_mode: {
        title: '(Mode développeur)',
        description:
          '(Activer certaines fonctionnalités orientées développeur, notamment des journaux de console détaillés et des menus contextuels natifs.)',
        switch_label: '(Activer le mode développeur)',
      },
      deploy_hook: {
        title: '(Hook de déploiement)',
        description:
          '(Entrez une URL de webhook à appeler lorsque vous déclenchez manuellement un déploiement en sélectionnant Publier les modifications. Cela peut être laissé vide si vous utilisez GitHub Actions.)',
        url: {
          field_label: '(URL du hook)',
          saved: "(L'URL du hook a été enregistrée.)",
          removed: "(L'URL du hook a été supprimée.)",
        },
        auth: {
          field_label: "(En-tête d'autorisation (ex. Bearer <token>) (facultatif))",
          saved: "(L'en-tête d'autorisation a été enregistré.)",
          removed: "(L'en-tête d'autorisation a été supprimé.)",
        },
      },
    },
  },

  // Keyboard shortcuts
  keyboard_shortcuts_: {
    view_content_library: '(Voir la bibliothèque de contenus)',
    view_asset_library: '(Voir la bibliothèque de ressources)',
    search: '(Rechercher des entrées et des ressources)',
    create_entry: '(Créer une nouvelle entrée)',
    save_entry: '(Enregistrer une entrée)',
    cancel_editing: "(Annuler la modification d'une entrée)",
  },

  // File types
  file_type_labels: {
    avif: '(Image AVIF)',
    bmp: '(Image Bitmap)',
    gif: '(Image GIF)',
    ico: '(Icône)',
    jpeg: '(Image JPEG)',
    jpg: '(Image JPEG)',
    png: '(Image PNG)',
    svg: '(Image SVG)',
    tif: '(Image TIFF)',
    tiff: '(Image TIFF)',
    webp: '(Image WebP)',
    avi: '(Vidéo AVI)',
    m4v: '(Vidéo MP4)',
    mov: '(Vidéo QuickTime)',
    mp4: '(Vidéo MP4)',
    mpeg: '(Vidéo MPEG)',
    mpg: '(Vidéo MPEG)',
    ogg: '(Vidéo Ogg)',
    ogv: '(Vidéo Ogg)',
    ts: '(Vidéo MPEG)',
    webm: '(Vidéo WebM)',
    '3gp': '(Vidéo 3GPP)',
    '3g2': '(Vidéo 3GPP2)',
    aac: '(Audio AAC)',
    mid: '(MIDI)',
    midi: '(MIDI)',
    m4a: '(Audio MP4)',
    mp3: '(Audio MP3)',
    oga: '(Audio Ogg)',
    opus: '(Audio OPUS)',
    wav: '(Audio WAV)',
    weba: '(Audio WebM)',
    csv: '(Feuille de calcul CSV)',
    doc: '(Document Word)',
    docx: '(Document Word)',
    odp: '(Présentation OpenDocument)',
    ods: '(Feuille de calcul OpenDocument)',
    odt: '(Texte OpenDocument)',
    pdf: '(Document PDF)',
    ppt: '(Présentation PowerPoint)',
    pptx: '(Présentation PowerPoint)',
    rtf: '(Document texte enrichi)',
    xls: '(Feuille de calcul Excel)',
    xlsx: '(Feuille de calcul Excel)',
    html: '(Texte HTML)',
    js: '(JavaScript)',
    json: '(Texte JSON)',
    md: '(Texte Markdown)',
    toml: '(Texte TOML)',
    yaml: '(Texte YAML)',
    yml: '(Texte YAML)',
  },

  // file size units
  file_size_units: {
    b: '({size} octets)',
    kb: '({size} Ko)',
    mb: '({size} Mo)',
    gb: '({size} Go)',
    tb: '({size} To)',
  },
};
