$(document).ready(function(){
  var url_base = 'http://157.230.17.132:4011/sales';

  // richiamo la funzione prendiDati (metodo get)
  prendiDati(url_base);

  // quando clicco su 'Aggiungi vendita'
  $('a.aggiungi_vendita').click(function(){

    // prendo il venditore che ha selezionato l'utente
    var venditore_selezionato = $('select.venditori').val();
    // prendo il mese che ha selezionato l'utente
    var mese_selezionato = $('select.mesi').val();
    // prendo il valore dell'input text
    var valore_vendita = $('input').val();
    // trasformo il mese in una data completa, es. 01/02/2017
    var data_del_mese_selezionato = '01/' + moment(mese_selezionato, 'MMMM').format('MM') + '/2017';
    // per controllare che l'utente abbia scritto qualcosa nell'input text, che sia un numero e sia > 0, che la lunghezza del value selezionato nelle select è != 0
    if (valore_vendita.length > 0 && valore_vendita > 0 && !isNaN(valore_vendita) && venditore_selezionato.length != 0 && mese_selezionato.length != 0) {
      $.ajax({
        url: url_base,
        method: 'post',
        data: JSON.stringify({
          salesman: venditore_selezionato,
          amount: parseInt(valore_vendita),
          date: data_del_mese_selezionato
        }),
        contentType: 'application/json',
        success: function(risultati){
          // richiamo la funzione prendiDati
          prendiDati(url_base);
        },
        error: function(){
          alert('errore');
        }
      });

      // resetto la select dei venditori
      $('select.venditori option:first-child').attr('selected', true);
      // resetto la select dei mesi
      $('select.mesi option:first-child').attr('selected', true);
      // azzero la input text
      $('input').val('');
    } else {
      alert('Inserisci valore');
    }

  });


});

function prendiDati(url_base){
  var labels_mesi = [];
  var data_soldi = [];
  var labels = [];
  var fatturato_totale = 0;
  var percentuale = [];
  var array_vendite = [];
  var mesi = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
      10: 0,
      11: 0,
      12: 0,
    };
  $.ajax({
    url: url_base,
    method: 'get',
    success: function(data){
      console.log(data);
      // svuoto la select dei mesi
      $('select.mesi').empty();
      // prima opzione della select
      $('select.mesi').append('<option value="">Seleziona mese dell\'anno</option>')

      // per l'andamento dell'azienda nell'anno 2017
      for (var i = 0; i < data.length; i++) {
        var mese = moment(data[i].date, 'DD/MM/YYYY').format('M');
        // inserisco il totale di ogni mese come valore
        mesi[mese] += data[i].amount;
      };
      // per il primo Chart
      firstChart(mesi, labels_mesi, data_soldi);


      // per la percentuale vendite effettuate dai venditori
      // mi preparo i dati per il grafico
      for (var i = 0; i < data.length; i++) {
        // recupero il venditore
        var venditore = data[i].salesman;
        // controllo se non ho ancora inserito questo venditori
        // nell'array di tutti i venditori
        if(!labels.includes(venditore)) {
          labels.push(venditore);
        }
      }

      // svuoto la select dei venditori
      $('select.venditori').empty();
      // prima opzione della select
      $('select.venditori').append('<option value="">Seleziona venditore</option>')
      // ciclo sui venditori che mi sono già estratto
      for (var i = 0; i < labels.length; i++) {
        var venditore_corrente = labels[i];
        // preparo una variabile per sommare le vendite di questo venditore
        var somma_vendite_singolo_venditore = 0;
        // ciclando l'array dei venditori appendo alla select i vari venditori
        $('select.venditori').append('<option value="' + labels[i] + '">' + labels[i] + '</option>');

        // ciclo tutti i dati iniziali
        for (var j = 0; j < data.length; j++) {
          var vendita_corrente = data[j];
          // per ogni oggetto dell'array iniziale
          // controllo se il venditore corrisponde al venditore corrente
          // se sì => sommo le vendite di quel venditore al totale delle vendite del venditore
          if(vendita_corrente.salesman == venditore_corrente) {
            somma_vendite_singolo_venditore += vendita_corrente.amount
          }
        }
        // inserisco la somma dentro all'array dei dati
        array_vendite.push(somma_vendite_singolo_venditore);
      }

      percentualeVenditore(array_vendite, fatturato_totale, percentuale);
      // // per il secondo Chart
      secondChart(labels, percentuale);
    },
    error: function(){
      alert('errore');
    }
  });
}

// funzione per la percentuale delle vendite dei singoli venditori
function percentualeVenditore(array_vendite, fatturato_totale, percentuale){
  // scorro l'array vendite
  for (var i = 0; i < array_vendite.length; i++) {
    // sommo al totale le vendite totali del singolo venditore che ciclo
    fatturato_totale += array_vendite[i];
  }
  // ciclo l'array vendite
  for (var i = 0; i < array_vendite.length; i++) {
    // pusho in un array percentuale le percentuali di ciascun venditore
    percentuale.push((((array_vendite[i]/fatturato_totale)*100).toFixed(2)));
  }
}

// per il primo chart
function firstChart(mesi, labels_mesi, data_soldi){
  var firstChart = $('#myfirstChart');
  var myfirstChart = new Chart(firstChart, {
    type: 'line',
    data: {
      labels: prendiMesi(mesi, labels_mesi),
      datasets: [{
        label: '# of Votes',
        data: prendiValori(mesi, data_soldi),
        backgroundColor: 'blue',
        borderColor: 'blue',
        fill: false
      }]
    },
  });
}

// per i mesi che mi serviranno per l'asse X del grafico
function prendiMesi(mesi, labels_mesi){
  for(var val in mesi){
    labels_mesi.push(moment(val, 'M').format('MMMM'));
  }

  for (var i = 0; i < labels_mesi.length; i++) {
    // appendo alla select dei mesi ogni mese
    $('select.mesi').append('<option value="' + labels_mesi[i] + '">' + labels_mesi[i] + '</option>');
  }
  return(labels_mesi);
};

// per i valori che mi serviranno per l'asse Y del grafico
function prendiValori(mesi, data_soldi){
  for(var val in mesi){
    data_soldi.push(mesi[val]);
  }
  return(data_soldi);
}

// per il secondo chart
function secondChart(labels, percentuale){
  var secondChart = $('#mysecondChart');
  var mysecondChart = new Chart(secondChart, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
          label: '# of Votes',
          data: percentuale,
          backgroundColor: ['red', 'blue', 'yellow', 'green'],
          borderWidth: 1
      }]
    },
  });
}
