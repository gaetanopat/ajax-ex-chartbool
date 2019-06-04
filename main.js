$(document).ready(function(){
  var url_base = 'http://157.230.17.132:4011/sales';
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
      // console.log(data);
      for (var i = 0; i < data.length; i++) {
        // console.log(data[i].date);
        var mese = moment(data[i].date, 'DD/MM/YYYY').format('M');
        // console.log(mese);
        for (var val in mesi) {
          if (val == mese) {
            mesi[val] += data[i].amount;
          };
        };
      };
      // per il primo Chart
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
    },
    error: function(){
      alert('errore');
    }
  });



  $.ajax({
    url: url_base,
    method: 'get',
    success: function(data){
      // mi preparo i dati per il grafico
      for (var i = 0; i < data.length; i++) {
        // recupero il continente
        console.log(data[i].salesman);
        var venditore = data[i].salesman;
        // controllo se non ho ancora inserito questo venditori
        // nell'array di tutti i venditori
        if(!labels.includes(venditore)) {
          labels.push(venditore);
        }
      }

      // ciclo sui venditori che mi sono già estratto
      for (var i = 0; i < labels.length; i++) {
        var venditore_corrente = labels[i];
        // preparo una variabile per sommare le vendite di questo venditore
        var somma_vendite_singolo_venditore = 0;
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

      // per il secondo Chart
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
    },
    error: function(){
      alert('errore');
    }
  });
});

// per i mesi che mi serviranno per l'asse X del grafico
function prendiMesi(mesi, labels_mesi){
  for(var val in mesi){
    labels_mesi.push(moment(val, 'M').format('MMMM'));
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
