/*

MON PROGRAMME : 

> Je veux pouvoir donner la définition d'un mot à mes utilisateurs

- 1. Récupérer le mot saisi par l'utilisateur
- 2. Envoyer le mot à l'API ( https://dictionaryapi.dev/ )
- 3. Récupérer le JSON (la donnée) en lien avec mon mot
- 4. Afficher les informations de mon mot sur ma page (HTML)
- 5. Ajouter un lecteur pour écouter la prononciation du mot

*/

/* ÉTAPE 1 : Récupérer mon mot */

/*"submit" c qd je viens cliquer sur le bouton du type="submit" 
qui est à l'interieur d un form ca va lancer un evnt*/

const watchSubmit = () =>{
  const form = document.querySelector("#form");/*id form */
  form.addEventListener ("submit",(event) => {
    /*pr annuler le cportement par defaut càd la page se reactualise auto on perd les info */
    event.defaultPrevented(); 
    const data = new FormData(form);/*pr recup la donnée grace à son name*/
    const wordToSearch = data.get("search");
    apiCall(wordToSearch);/*mon mot est env à ma fonction apiCall */
  })
}

/*ETAPE 2: Envoyer le mot à l'API */
const apiCall = (word) => {
  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then((response) => response.json())
    .then ((data) => {
      /*ETAPE 3: Récupérer le JSON (la donnée) en lien avec mon mot */
      const wordInformation = data[0]
    })
}

watchSubmit ()
