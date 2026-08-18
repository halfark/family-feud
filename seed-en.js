// Anglické ESL sady pro 3.–9. třídu ZŠ.
// grade: "Grade 3–5 (A1)" | "Grade 6–7 (A1–A2)" | "Grade 8–9 (A2–B1)"

const G1 = 'Grade 3–5 (A1)';
const G2 = 'Grade 6–7 (A1–A2)';
const G3 = 'Grade 8–9 (A2–B1)';

module.exports = [
  // ================= GRADE 3–5 — A1 =================
  { title: 'Colours and Shapes', topic: 'Vocabulary', grade: G1, questions: [
    { question: 'Name a colour.', answers: [
      {text:'Blue',points:26},{text:'Red',points:24},{text:'Green',points:18},
      {text:'Yellow',points:14},{text:'Black',points:10},{text:'Pink',points:8}]},
    { question: 'Name a shape.', answers: [
      {text:'Circle',points:32},{text:'Square',points:28},{text:'Triangle',points:22},
      {text:'Rectangle',points:12},{text:'Star',points:6}]},
  ]},

  { title: 'Animals', topic: 'Vocabulary', grade: G1, questions: [
    { question: 'Name a pet.', answers: [
      {text:'Dog',points:38},{text:'Cat',points:30},{text:'Rabbit',points:12},
      {text:'Hamster',points:10},{text:'Fish',points:6},{text:'Parrot',points:4}]},
    { question: 'Name a farm animal.', answers: [
      {text:'Cow',points:30},{text:'Pig',points:24},{text:'Horse',points:18},
      {text:'Sheep',points:14},{text:'Chicken',points:10},{text:'Goat',points:4}]},
    { question: 'Name a wild animal.', answers: [
      {text:'Lion',points:28},{text:'Elephant',points:24},{text:'Tiger',points:18},
      {text:'Bear',points:14},{text:'Monkey',points:10},{text:'Giraffe',points:6}]},
  ]},

  { title: 'Food and Drink', topic: 'Vocabulary', grade: G1, questions: [
    { question: 'Name a fruit.', answers: [
      {text:'Apple',points:32},{text:'Banana',points:26},{text:'Orange',points:18},
      {text:'Strawberry',points:12},{text:'Grapes',points:8},{text:'Pear',points:4}]},
    { question: 'Name a vegetable.', answers: [
      {text:'Carrot',points:30},{text:'Potato',points:24},{text:'Tomato',points:20},
      {text:'Cucumber',points:14},{text:'Onion',points:8},{text:'Broccoli',points:4}]},
    { question: 'Name something you drink.', answers: [
      {text:'Water',points:34},{text:'Juice',points:24},{text:'Milk',points:18},
      {text:'Tea',points:12},{text:'Lemonade',points:8},{text:'Hot chocolate',points:4}]},
  ]},

  { title: 'My Family', topic: 'Vocabulary', grade: G1, questions: [
    { question: 'Name a member of your family.', answers: [
      {text:'Mum',points:26},{text:'Dad',points:24},{text:'Sister',points:18},
      {text:'Brother',points:16},{text:'Grandma',points:10},{text:'Grandpa',points:6}]},
    { question: 'Name something you do with your family.', answers: [
      {text:'Eat dinner',points:28},{text:'Watch TV',points:24},{text:'Go on holiday',points:20},
      {text:'Play games',points:16},{text:'Go for a walk',points:12}]},
  ]},

  { title: 'School Things', topic: 'School', grade: G1, questions: [
    { question: 'Name something in your pencil case.', answers: [
      {text:'Pencil',points:30},{text:'Pen',points:26},{text:'Rubber',points:18},
      {text:'Ruler',points:12},{text:'Sharpener',points:8},{text:'Crayons',points:6}]},
    { question: 'Name a school subject.', answers: [
      {text:'Maths',points:26},{text:'English',points:24},{text:'PE',points:20},
      {text:'Art',points:14},{text:'Music',points:10},{text:'Science',points:6}]},
  ]},

  { title: 'My Body', topic: 'Vocabulary', grade: G1, questions: [
    { question: 'Name a part of the body.', answers: [
      {text:'Hand',points:24},{text:'Leg',points:22},{text:'Head',points:18},
      {text:'Arm',points:14},{text:'Foot',points:12},{text:'Back',points:10}]},
    { question: 'Name something on your face.', answers: [
      {text:'Eyes',points:30},{text:'Nose',points:26},{text:'Mouth',points:20},
      {text:'Ears',points:14},{text:'Hair',points:6},{text:'Chin',points:4}]},
  ]},

  { title: 'Clothes', topic: 'Vocabulary', grade: G1, questions: [
    { question: 'Name something you wear.', answers: [
      {text:'T-shirt',points:26},{text:'Trousers',points:22},{text:'Shoes',points:20},
      {text:'Jacket',points:14},{text:'Dress',points:10},{text:'Socks',points:8}]},
    { question: 'Name something you wear in winter.', answers: [
      {text:'Coat',points:30},{text:'Scarf',points:24},{text:'Gloves',points:20},
      {text:'Hat',points:16},{text:'Boots',points:10}]},
  ]},

  { title: 'Days, Months and Time', topic: 'Vocabulary', grade: G1, questions: [
    { question: 'Name a day of the week.', answers: [
      {text:'Monday',points:26},{text:'Friday',points:24},{text:'Saturday',points:20},
      {text:'Sunday',points:16},{text:'Wednesday',points:8},{text:'Tuesday',points:6}]},
    { question: 'Name a month of the year.', answers: [
      {text:'December',points:24},{text:'January',points:20},{text:'June',points:18},
      {text:'July',points:16},{text:'September',points:12},{text:'May',points:10}]},
  ]},

  // ================= GRADE 6–7 — A1/A2 =================
  { title: 'Daily Routine', topic: 'Everyday life', grade: G2, questions: [
    { question: 'Name something you do every morning.', answers: [
      {text:'Get up',points:26},{text:'Brush my teeth',points:24},{text:'Have breakfast',points:20},
      {text:'Get dressed',points:16},{text:'Wash my face',points:8},{text:'Check my phone',points:6}]},
    { question: 'Name something you do before you go to bed.', answers: [
      {text:'Brush my teeth',points:30},{text:'Have a shower',points:22},{text:'Read a book',points:18},
      {text:'Watch a video',points:16},{text:'Set an alarm',points:8},{text:'Say goodnight',points:6}]},
  ]},

  { title: 'Hobbies and Free Time', topic: 'Everyday life', grade: G2, questions: [
    { question: 'Name a hobby.', answers: [
      {text:'Football',points:24},{text:'Reading',points:20},{text:'Gaming',points:18},
      {text:'Drawing',points:16},{text:'Dancing',points:12},{text:'Playing an instrument',points:10}]},
    { question: 'Name something you do at the weekend.', answers: [
      {text:'Meet friends',points:28},{text:'Sleep in',points:22},{text:'Play sport',points:18},
      {text:'Go shopping',points:16},{text:'Help at home',points:10},{text:'Do homework',points:6}]},
  ]},

  { title: 'Sports', topic: 'Sport', grade: G2, questions: [
    { question: 'Name a sport you play with a ball.', answers: [
      {text:'Football',points:34},{text:'Basketball',points:24},{text:'Volleyball',points:16},
      {text:'Tennis',points:12},{text:'Handball',points:8},{text:'Rugby',points:6}]},
    { question: 'Name a winter sport.', answers: [
      {text:'Skiing',points:32},{text:'Ice hockey',points:26},{text:'Snowboarding',points:20},
      {text:'Ice skating',points:14},{text:'Sledging',points:8}]},
  ]},

  { title: 'House and Home', topic: 'Everyday life', grade: G2, questions: [
    { question: 'Name a room in a house.', answers: [
      {text:'Kitchen',points:26},{text:'Bedroom',points:24},{text:'Bathroom',points:20},
      {text:'Living room',points:18},{text:'Hall',points:8},{text:'Garage',points:4}]},
    { question: 'Name something you find in a kitchen.', answers: [
      {text:'Fridge',points:28},{text:'Cooker',points:22},{text:'Table',points:18},
      {text:'Sink',points:14},{text:'Microwave',points:10},{text:'Kettle',points:8}]},
  ]},

  { title: 'Jobs and Work', topic: 'Society', grade: G2, questions: [
    { question: 'Name a job.', answers: [
      {text:'Teacher',points:24},{text:'Doctor',points:22},{text:'Firefighter',points:18},
      {text:'Police officer',points:16},{text:'Chef',points:12},{text:'Driver',points:8}]},
    { question: 'Name a job where you wear a uniform.', answers: [
      {text:'Police officer',points:28},{text:'Nurse',points:24},{text:'Firefighter',points:20},
      {text:'Soldier',points:14},{text:'Pilot',points:10},{text:'Waiter',points:4}]},
  ]},

  { title: 'Places in Town', topic: 'Everyday life', grade: G2, questions: [
    { question: 'Name a place in a town.', answers: [
      {text:'School',points:24},{text:'Park',points:20},{text:'Shop',points:18},
      {text:'Library',points:16},{text:'Hospital',points:12},{text:'Cinema',points:10}]},
    { question: 'Name a place where you can buy food.', answers: [
      {text:'Supermarket',points:34},{text:'Bakery',points:24},{text:'Market',points:18},
      {text:'Butcher’s',points:12},{text:'Petrol station',points:8},{text:'Café',points:4}]},
  ]},

  { title: 'Weather and Seasons', topic: 'Nature', grade: G2, questions: [
    { question: 'Name a type of weather.', answers: [
      {text:'Sunny',points:28},{text:'Rainy',points:24},{text:'Windy',points:18},
      {text:'Snowy',points:16},{text:'Cloudy',points:10},{text:'Foggy',points:4}]},
    { question: 'Name something you do in summer.', answers: [
      {text:'Swim',points:30},{text:'Go on holiday',points:24},{text:'Ride a bike',points:16},
      {text:'Eat ice cream',points:14},{text:'Camp',points:10},{text:'Sunbathe',points:6}]},
  ]},

  { title: 'Holidays and Celebrations', topic: 'Culture', grade: G2, questions: [
    { question: 'Name a holiday or celebration.', answers: [
      {text:'Christmas',points:32},{text:'Easter',points:24},{text:'Birthday',points:18},
      {text:'New Year',points:14},{text:'Halloween',points:8},{text:'Valentine’s Day',points:4}]},
    { question: 'Name something people do at Christmas.', answers: [
      {text:'Give presents',points:30},{text:'Decorate a tree',points:26},{text:'Eat a big meal',points:20},
      {text:'Sing carols',points:12},{text:'Visit family',points:8}]},
  ]},

  // ================= GRADE 8–9 — A2/B1 =================
  { title: 'Travel and Transport', topic: 'Travel', grade: G3, questions: [
    { question: 'Name a means of transport.', answers: [
      {text:'Car',points:26},{text:'Bus',points:22},{text:'Train',points:20},
      {text:'Plane',points:16},{text:'Bike',points:10},{text:'Tram',points:6}]},
    { question: 'Name something you pack in a suitcase.', answers: [
      {text:'Clothes',points:30},{text:'Toothbrush',points:22},{text:'Phone charger',points:18},
      {text:'Passport',points:14},{text:'Sunscreen',points:10},{text:'Shoes',points:6}]},
    { question: 'Name an English-speaking country.', answers: [
      {text:'The UK',points:30},{text:'The USA',points:28},{text:'Australia',points:18},
      {text:'Canada',points:14},{text:'Ireland',points:6},{text:'New Zealand',points:4}]},
  ]},

  { title: 'Technology and Media', topic: 'Technology', grade: G3, questions: [
    { question: 'Name something you do on a smartphone.', answers: [
      {text:'Send messages',points:28},{text:'Watch videos',points:24},{text:'Take photos',points:18},
      {text:'Play games',points:14},{text:'Listen to music',points:10},{text:'Make calls',points:6}]},
    { question: 'Name a device you use every day.', answers: [
      {text:'Phone',points:34},{text:'Laptop',points:24},{text:'Headphones',points:16},
      {text:'TV',points:14},{text:'Tablet',points:8},{text:'Smartwatch',points:4}]},
  ]},

  { title: 'Environment', topic: 'Nature', grade: G3, questions: [
    { question: 'Name something you can recycle.', answers: [
      {text:'Paper',points:28},{text:'Plastic bottles',points:26},{text:'Glass',points:20},
      {text:'Cardboard',points:14},{text:'Cans',points:8},{text:'Batteries',points:4}]},
    { question: 'Name a way to help the planet.', answers: [
      {text:'Recycle',points:26},{text:'Save water',points:22},{text:'Use less plastic',points:20},
      {text:'Cycle or walk',points:16},{text:'Turn off lights',points:10},{text:'Plant trees',points:6}]},
  ]},

  { title: 'Health and Lifestyle', topic: 'Health', grade: G3, questions: [
    { question: 'Name something healthy people do.', answers: [
      {text:'Exercise',points:30},{text:'Eat vegetables',points:24},{text:'Sleep well',points:18},
      {text:'Drink water',points:16},{text:'Avoid junk food',points:8},{text:'Go outside',points:4}]},
    { question: 'Name a reason to see a doctor.', answers: [
      {text:'A high temperature',points:26},{text:'A bad cough',points:22},{text:'A broken bone',points:20},
      {text:'A headache',points:16},{text:'A check-up',points:10},{text:'A sore throat',points:6}]},
  ]},

  { title: 'Shopping and Money', topic: 'Everyday life', grade: G3, questions: [
    { question: 'Name a shop in a shopping centre.', answers: [
      {text:'Clothes shop',points:30},{text:'Shoe shop',points:22},{text:'Bookshop',points:18},
      {text:'Electronics shop',points:14},{text:'Pharmacy',points:10},{text:'Toy shop',points:6}]},
    { question: 'Name something teenagers spend money on.', answers: [
      {text:'Clothes',points:28},{text:'Food and snacks',points:24},{text:'Games',points:20},
      {text:'Music or apps',points:14},{text:'Cinema tickets',points:10},{text:'Sports gear',points:4}]},
  ]},

  { title: 'Feelings and Personality', topic: 'Society', grade: G3, questions: [
    { question: 'Name a word to describe a good friend.', answers: [
      {text:'Kind',points:26},{text:'Funny',points:22},{text:'Honest',points:20},
      {text:'Helpful',points:16},{text:'Loyal',points:10},{text:'Patient',points:6}]},
    { question: 'Name something that makes people nervous.', answers: [
      {text:'Exams',points:32},{text:'Speaking in public',points:26},{text:'The dentist',points:16},
      {text:'Meeting new people',points:14},{text:'Flying',points:8},{text:'Job interviews',points:4}]},
  ]},

  { title: 'Irregular Verbs', topic: 'Grammar', grade: G3, questions: [
    { question: 'Name an irregular verb in the past simple.', answers: [
      {text:'Went',points:26},{text:'Was / were',points:22},{text:'Did',points:16},
      {text:'Saw',points:14},{text:'Took',points:12},{text:'Made',points:10}]},
    { question: 'Which verbs do we use to make questions?', answers: [
      {text:'Do / does',points:32},{text:'Be (am, is, are)',points:26},{text:'Did',points:18},
      {text:'Can',points:14},{text:'Have / has',points:10}]},
  ]},

  { title: 'The English-Speaking World', topic: 'Culture', grade: G3, questions: [
    { question: 'What is Britain famous for?', answers: [
      {text:'Big Ben',points:26},{text:'The Royal Family',points:22},{text:'Tea',points:18},
      {text:'Red buses',points:14},{text:'Football',points:12},{text:'Rainy weather',points:8}]},
    { question: 'Name a city in the United Kingdom.', answers: [
      {text:'London',points:40},{text:'Manchester',points:20},{text:'Liverpool',points:16},
      {text:'Edinburgh',points:12},{text:'Birmingham',points:8},{text:'Glasgow',points:4}]},
    { question: 'Name something you associate with the USA.', answers: [
      {text:'New York',points:26},{text:'Hollywood',points:22},{text:'Fast food',points:18},
      {text:'The Statue of Liberty',points:16},{text:'Basketball',points:10},{text:'Route 66',points:6}]},
  ]},

  { title: 'School Life and Future Plans', topic: 'School', grade: G3, questions: [
    { question: 'Name a reason to learn English.', answers: [
      {text:'Travel',points:30},{text:'Get a good job',points:26},{text:'Watch films and series',points:18},
      {text:'Talk to people abroad',points:14},{text:'Study abroad',points:8},{text:'Play games online',points:4}]},
    { question: 'Name something students do to prepare for an exam.', answers: [
      {text:'Revise notes',points:28},{text:'Practise past papers',points:22},{text:'Study with a friend',points:18},
      {text:'Make flashcards',points:14},{text:'Ask the teacher',points:10},{text:'Watch tutorials',points:8}]},
  ]},
];
