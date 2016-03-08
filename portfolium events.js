prev_event = time = "";
margin = limit = position = line = eventPos = 0;
side = "left";
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
      var cur_event = this;

      $.each(global_events, function(index){
        if(this.begin_date <= cur_event.begin_date)
          eventPos = index;
      });

      if(cur_event.type == "milestone"){
        if(side=="left"){
          var eltemp = $('#events_box_left_milestone').clone();
          $(eltemp).css("display", "").appendTo(".events.left");
        }
        else {
          var eltemp = $('#events_box_right_milestone').clone();
          $(eltemp).css("display", "").appendTo(".events.right");
        }
        $(eltemp).css("margin-top", ((time ? "future" : "past") != time ? limit+70 : margin) + "px");
        prev_event = global_events[index].type;
      }
      else{
        if(side=="left"){
          var eltemp = $('#events_box_left').clone();
          $(eltemp).css("display", "").appendTo(".events.left");
        }
        else{
          var eltemp = $('#events_box_right').clone();
          $(eltemp).css("display", "").appendTo(".events.right");
        }
        $(eltemp).css("margin-top", ((time ? "future" : "past") != time ? limit+70 : margin) + "px");
        prev_event = global_events[index].type;
      }

      $(eltemp).find(".event_title").text(cur_event.title);
      $(eltemp).find(".event_date").text(cur_event.date);
      $(eltemp).find(".event_description").text(cur_event.description);
      if(cur_event.type == "show")
        if(!cur_event.image)
          $(eltemp).find('img').last().css("display", "none");
        else
          $(eltemp).find('img').last().attr('src', cur_event.image);

      // position += $(eltemp).height() + (cur_event.image ? ($(eltemp).find('img').last().height() < 40 ? cur_event.imageHeight.height : 0) : 0) + parseInt($(eltemp).css("margin-top"));
      position += $(eltemp).height() + parseInt($(eltemp).css("margin-top"));

      if(position >= limit || limit - position < 20){
        side = (side == "left" ? "right" : "left");
        margin = (limit ? (position - limit) : 80);
        if(margin > 100)
          margin = 80;
        else if(margin < 20)
          margin = 50;
        limit = position - limit;
        if(time == "future"){
          $(".events.center .event_line_future").css("height", line+130);
          $(".events.center hr").css("display","");
          line = 0;
          time = "past"; 
          margin +=50;
        }
        line += limit;
        position = 0;
      }
      else{
        margin = 50;
      }

      if(time){
        $(".events.center .event_line_future").css("height",limit + 120);
        $(".events.center hr").css("display","");
      }
    });

    $(".events.center .event_line_past").css("height", Math.max($(".events.right").height(), $(".events.left").height()) + 80);
  };

  $(".menu form").on("submit", function(event) {
    // Prevents the form from being submited
    event.preventDefault();
    var errors = [];

    if(new Date(this.begin_date.value) > new Date(this.end_date.value)){
      errors.push("Begin date can't be higher than end date.");
    }

    event = [
      {
        type: "Milestone",
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

  addEvent(global_events);
});

