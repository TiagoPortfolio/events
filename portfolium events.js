previous = "";
margin = limit = position = line = 0;
side = "left";
switchside = true;
time = "future";
today = new Date();
global_events = [
  {
    type: 'milestone',
    future: true,
    title: 'World Peace',
    begin_date: new Date(new Date(today).setDate(today.getDate() + 1)),
    end_date: new Date(new Date(today).setDate(today.getDate() + 1)),
    description: 'Make the world a better place!',
    image: false,
  }
];

//Ready
$(document).ready(function(){

  function addEvent(events){
    $.each(events, function(index){
      time = (this.begin_date > today ? "future" : "past");

      if(this.type == "milestone"){
        if(side=="left"){
          var eltemp = $('#meetus_box_left_milestone').clone();
          $(eltemp).css("display", "").appendTo(".meetus.left");
        }
        else {
          var eltemp = $('#meetus_box_right_milestone').clone();
          $(eltemp).css("display", "").appendTo(".meetus.right");
        }
        $(eltemp).css("margin-top", ((time ? "future" : "past") != time ? limit+70 : margin) + "px");
        previous = "milestone";
      }
      else{
        if(side=="left"){
          var eltemp = $('#meetus_box_left').clone();
          $(eltemp).css("display", "").appendTo(".meetus.left");
        }
        else{
          var eltemp = $('#meetus_box_right').clone();
          $(eltemp).css("display", "").appendTo(".meetus.right");
        }
        $(eltemp).css("margin-top", ((time ? "future" : "past") != time ? limit+70 : margin) + "px");
        previous = "show";
      }

      $(eltemp).find(".event_title").text(this.title);
      $(eltemp).find(".event_date").text(this.date);
      $(eltemp).find(".event_description").text(this.description);
      if(this.type == "show")
        if(!this.image)
          $(eltemp).find('img').last().css("display", "none");
        else
          $(eltemp).find('img').last().attr('src', this.image);

      // position += $(eltemp).height() + (this.image ? ($(eltemp).find('img').last().height() < 40 ? this.imageHeight.height : 0) : 0) + parseInt($(eltemp).css("margin-top"));
      position += $(eltemp).height() + parseInt($(eltemp).css("margin-top"));

      if(position >= limit || limit - position < 20){
        switchSide = true;
        side = (side == "left" ? "right" : "left");
        margin = (limit ? (position - limit) : 80);
        if(margin > 100)
          margin = 80;
        else if(margin < 20)
          margin = 50;
        limit = position - limit;
        if((time ? "future" : "past") != time){
          $(".meetus.center .event_line_future").css("height", line+130);
          $(".meetus.center hr").css("display","");
          line = 0;
          time = "past"; 
          margin +=50;
        }
        line += limit;
        position = 0;
      }
      else{
        switchSide = false;
        margin = 50;
      }

      if(time){
        $(".meetus.center .event_line_future").css("height",limit + 120);
        $(".meetus.center hr").css("display","");
      }
    });

    $(".meetus.center .event_line_past").css("height", Math.max($(".meetus.right").height(), $(".meetus.left").height()) + 80);
  };

  addEvent(global_events);

  $(".menu form").on("submit", function(event) {
    // Prevents the form from being submited
    event.preventDefault();

    this.begin_date.value;
    this.end_date.value;
    this.type.value = "Milestone";

    event = [
      {
        type: this.type.value,
        future: true,
        title: this.title.value,
        begin_date: new Date(this.begin_date.value),
        end_date: new Date(this.end_date.value),
        description: this.description.value,
        image: false,
      }
    ];

    addEvent(event);
  });

});

