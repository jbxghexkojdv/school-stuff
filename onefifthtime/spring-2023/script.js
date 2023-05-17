/*
¡ -> a1
¿ -> bf
á -> e1
é -> e9
í -> ed
ó -> f3
ú -> fa
*/
const sentences = [

  //English, Spanish, Literal English, Extra Words, Extra Words' Translations
  ["2 is a letter", "2 es una letra", "2 is a letter", "un est\xe1", "a/one is"],
  ["I found $2 on the floor", "Encontr\xe9 $2 en el piso", "(I)\xa0found $2 in/on/at the floor", "Yo la", "I the"],
  ["You are NOT my aunt's nephew (Informal)", "T\xfa NO eres el sobrino de mi t\xeda", "You NO/NOT (you)\xa0are the nephew of/from my aunt", "Usted es sobrina", "You (he/she/it)\xa0is niece"],
  ["0 isn't a number", "0 no es un n\xfamero", "0 no/not is a/one number", "una", "a/one"],
  ["Congratulations! Your teeth are now green! (Informal)", "\xa1Felicitaciones! \xa1Tus dientes ya son verdes!", "Congratulations! Your teeth now (they/you\xa0all)\xa0are green!", "\xa1Tu verde!", "Your green!"],
  ["I was just going shopping for 75 oranges", "Yo estaba s\xf3lo comprando 75 naranjas", "I (I/he/she)\xa0was only buying 75 oranges", "\xc9l", "He/him"],
  ["He said that, no?", "\xc9l lo dijo, \xbfno?", "He/him him/it said, no?", "Ella", "She/her"],
];

function arrayofNums(n)
{
  let retval = [];
  for(let i = 0; i < n; i++)
  {
    retval.push(i);
  }
  return retval;
}

function newWord(word)
{
  let retval = document.createElement("div");
  retval.innerHTML = word;
  retval.onclick = function(event)
  {
    if(retval.parentElement == document.getElementById("random-words"))
    {
      retval.remove();
      document.getElementById("words-in-order").appendChild(retval);
    }
    else
    {
      retval.remove();
      document.getElementById("random-words").appendChild(retval);
    }
  }
  
  document.getElementById("random-words").appendChild(retval);
  return retval;
}

function shuffle(array)
{
  let indices = [];
  let shuffledIndices = [];
  let retval = [];
  for(i in array)
  {
    indices.push(i);
  }
  for(i in array)
  {
    randnum = Math.floor(Math.random()*indices.length);
    shuffledIndices.push(indices[randnum]);
    indices.splice(randnum, 1);
  }
  for(i in array)
  {
    retval.push(array[shuffledIndices[i]]);
  }
  return retval;
}

let shouldBreak = false;
let sentenceNum = 0;

/**
 * Puts a sentence on the screen to be sorted by the users.
 * @param {string[]} sentence
 * @returns {void}
*/
function doSentence(sentence)
{
  if(typeof sentence != "object" || sentence.length != 5 || typeof sentence[0] != "string" ||
    typeof sentence[1] != "string" || typeof sentence[2] != "string" ||
    typeof sentence[3] != "string" || typeof sentence[4] != "string")
  {
    console.error("Invalid parameter: " + JSON.stringify(sentence));
  }
  document.getElementById("english-text").innerHTML = sentence[0];
  const indices = shuffle(arrayofNums(sentence[1].split(" ").length + sentence[3].split(" ").length));
  const spanishWords = indices.map((val, index, arr) => {
    if(val < sentence[1].split(" ").length)
    {
      return sentence[1].split(" ")[val];
    }
    return sentence[3].split(" ")[val - sentence[1].split(" ").length];
  });
  const meanings = indices.map((val, index, arr) => {
    if(val < sentence[2].split(" ").length)
    {
      return sentence[2].split(" ")[val];
    }
    return sentence[4].split(" ")[val - sentence[2].split(" ").length];
  });
  for(let i in spanishWords)
  {
    newWord(spanishWords[i] + "<span style='font-size: 20px;'><br />" + meanings[i] + "</span>").id = 
    ((sentence[1].split(" ").concat(sentence[3].split(" "))).findIndex((val, index, arr) => val == spanishWords[i]) > 
    sentence[1].split(" ").length - 1 ? "fake-" : "word-") + 
    (sentence[1].split(" ").concat(sentence[3].split(" "))).findIndex((val, index, arr) => val == spanishWords[i]);
  }
  let openSlots = spanishWords.length;
  document.onclick = () =>
  {
    openSlots = spanishWords.length - document.getElementById("words-in-order").children.length + 1 - sentence[3].split(" ").length;
    document.getElementById("count-hint").innerHTML = openSlots;
    if(openSlots == 0)
    {
      // Loops over "in order" words in reverse, ignores the count element
      for(let i = document.getElementById("words-in-order").children.length-1; i > 0; i--)
      {
        if(document.getElementById("words-in-order").children[i].id != "word-" + (i - 1))
        {
          shouldBreak = false;
          break;
        }
        if(i == 1)
        {
          shouldBreak = true;
          // Removes "in order" words in reverse order, ignores the count element
          for(let i = document.getElementById("words-in-order").children.length-1; i > 0; i--)
          {
            document.getElementById("words-in-order").children[i].remove();
          }
          // Removes leftover words in reverse order
          for(let i = document.getElementById("random-words").children.length-1; i > -1; i--)
          {
            document.getElementById("random-words").children[i].remove();
          }
        }
      }
    }
    else
    {
      shouldBreak = false;
    }
  };
}
doSentence(sentences[0]);
let int = setInterval(()=>
{
  if(shouldBreak)
  {
    sentenceNum++;
    shouldBreak = false;
    doSentence(sentences[sentenceNum]);
    document.body.click();
  }
}, 10);