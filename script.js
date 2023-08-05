/*

MON PROGRAMME : 

> Je veux pouvoir donner la définition d'un mot à mes utilisateurs

- 1. Récupérer le mot saisi par l'utilisateur
- 2. Envoyer le mot à l'API ( https://dictionaryapi.dev/ )
- 3. Récupérer le JSON (la donnée) en lien avec mon mot
- 4. Afficher les informations de mon mot sur ma page (HTML)
- 5. Ajouter un lecteur pour écouter la prononciation du mot

*/

/*console.log('0 wordToSearch', wordToSearch);*/

/* ÉTAPE 1 : Récupérer mon mot */

const watchSumbit = () => {
  const form = document.querySelector ("#form");
  form.addEventListener ("submit", (event) => {
    event.preventDefault(); /* annule le cportement par dfaut,ici reactualise la page revient à 0 on perd l info écrite*/
    const data = new FormData(form); /*FormData va recup name (name=search) */
    const wordToSearch = data.get("search"); /*pr recup la valeur de search */
    /*console.log('1 wordToSearch', wordToSearch);*/
    apiCall (wordToSearch)
})
};

/* ÉTAPE 2 : Envoyer mon mot à l'API */
const apiCall = (word) => {
  fetch (`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then ((response) => response.json ()) /*recup le mot de l api en format json*/
    .then ((data) => {
      /* ÉTAPE 3 : RÉCUPÉRER LA DONNÉE */
      const informationsNeeded = extractData (data[0]) /*recup le 1er elt trouvé */
      //console.log ("informationsNeeded", informationsNeeded)
      renderToHTML (informationsNeeded)
      
    })
    .catch((error) => {
      alert('Le mot demandé n\'existe pas'); /*au cas où le mot n'existe pas dans le dico api */
      console.error(error);
    })
    }

const extractData = (data) => {
    // 1- Mot
    const word = data.word /* recup uniquement le mot*/
    // 2- Ecriture phonétique
    const phonetic = findProp (data.phonetics, "text")/*ce que m env l api depuis phonetics,je cherche la propriété text */
    // 3- Prononciation (audio)
    const pronoun = findProp (data.phonetics, "audio") /* on cherche la propriété audio ds api */
    // 4-Définitions
    const meanings = data.meanings /*aller recup tt mon tab meanings ds api pr avoir les def */
    /*jusqu ici on ne fait que extraire/récupérer les donnees, après il faut les renvoyer avec return  */
    return {
      word: word,
      phonetic: phonetic,
      pronoun : pronoun,
      meanings: meanings
    }

}

const findProp = (array, name) => { /*elle attend un tab d objet array et la propriété name =text et audio */
  // Elle parcourt un tableau d objets
  for (let i = 0; i < array.length; i++) {
    // et cherche ds ce tableau si l objet en cours contient une certaine propriete
    const currentObject = array[i] /*je stocke l objet actuel avec qui je travail */
    const hasProp = currentObject.hasOwnProperty(name) /*est ce que tu as la propriété name (hasOwnProperty)true ou false */
    // alors elle envoie cette propriété 
    if (hasProp) return currentObject[name]
  }
}

/* ÉTAPE 4 : Afficher les informations de mon mot sur ma page */
const renderToHTML = (data) => {
  const card = document.querySelector ('.js-card') /*on va chercher la class de la section */
  card.classList.remove ('card--hidden') /*pr n afficher la carte q lorsque on cherche un mot */

  // manipulation de textes avec la propriété textContent
  const title = document.querySelector ('.js-card-title');/*aller sur h1 avec la class js-card-title */
  title.textContent = data.word /*pr ajouter du text ds le html ac textContent,le word je le prend de data */
  const phonetic = document.querySelector ('.js-card-phonetic')
  phonetic.textContent = data.phonetic
  
  //Création d'élements HTML dynamiques
  const list = document.querySelector ('.js-card-list')
  for (let i = 0; i < data.meanings.length; i++) { /*meanings ds api */
    const meaning = data.meanings[i]
    const partOfSpeech = meaning.partOfSpeech /*parOfSpeech ds api idem definitions */
    const definition = meaning.definitions[0].definition /*on va recup la 1ere valeur ds tab des defs et recu sa valeur def */
    // 1 - Avec un innerHTML
        // list.innerHTML += qi v dire ajouter dc on concatene car = ca permet de tt vider et mettre le li a la place `
        // <li class="card__meaning">
        //     <p class="card__part-of-speech">${partOfSpeech}</p>
        //     <p class="card__definition">${definition}</p>
        // </li>`
        // Attention : lisibilité peut être mauvaise quand on a de gros blocs HTML

        // 2 - Avec la création d'élements 
        const li = document.createElement ('li') /*on va creer les li car un mot p avoir plusieurs def donc impossible de prédire le nbre de li ds le html */
        li.classList.add ('card__meaning') /*pr ajouter des classes comme ca le style est appliqué */
        
        const pPartOfSpeech = document.createElement ('p')/*creer le p */
        pPartOfSpeech.textContent = partOfSpeech /*creer un elt ds un html ac textContent */
        pPartOfSpeech.classList.add('card__part-of-speech') /*ajouter une class avec classList */
        
        const pDefinition =  document.createElement ('p')
        pDefinition.textContent = definition
        pDefinition.classList.add('card__definition')
        
        li.appendChild (pPartOfSpeech) /*on va ajouter un enfant-p dans le li  */
        li.appendChild (pDefinition) /*pDefinition et pPartOfSpeech) st les enfants de li */
        list.appendChild (li)
  }
  // Ajout de l'audio en JS
  const button = document.querySelector ('.js-card-button')
  const audio = new Audio (data.pronoun)
  button.addEventListener ('click', () => {
    button.classList.remove ("card__player--off") /*supp une class */
    button.classList.add ("card__player--on") /*ajout d une class */
    audio.play () /*pr lancer l audio avec play */
  })

  audio.addEventListener ('ended', () =>{ /*qd lecture audio fini, on met en off */
    button.classList.remove ("card__player--on")
    button.classList.add ("card__player--off")
  })
}

// Lancement du programme 
watchSumbit ()



