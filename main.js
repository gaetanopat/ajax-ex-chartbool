$(document).ready(function(){
  var url_base = 'http://157.230.17.132:4011/sales';
  var arrayMesi_ripetuti = [];
  var arrayMesi_non_ripetuti = [];
  var arraySoldi = [];
  var arraySolditotali = [];
  var data_da_dare_a_moment;
  var soldi_per_ogni_mese = 0;
  var mesi = [1,2,3,4,5,6,7,8,9,10,11,12];
  $.ajax({
    url: url_base,
    method: 'get',
    success: function(data){
      // console.log(data);
      for (var i = 0; i < data.length; i++) {
        // console.log(data[i].date);
        var mese = moment(data[i].date, 'DD/MM/YYYY').month()+1;
        mesi[mese] += data[i].amount;
        // console.log(mese);
        // if(!arrayMesi_non_ripetuti.includes((moment(data_da_dare_a_moment, "DD-MM-YYYY").month()+1))){
        //   arrayMesi_non_ripetuti.push(moment(data_da_dare_a_moment, "DD-MM-YYYY").month()+1);
        // }
        // arrayMesi_ripetuti.push(moment(data_da_dare_a_moment, "DD-MM-YYYY").month()+1);
        // arraySoldi.push(soldi_per_ogni_mese);
      }
      console.log(mesi);
    },
    error: function(){
      alert('errore');
    }
  });
});
