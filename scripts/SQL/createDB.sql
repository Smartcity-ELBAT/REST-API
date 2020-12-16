drop table if exists locality cascade;
drop table if exists address cascade;
drop table if exists user_access_level cascade;
drop table if exists access_level cascade;
drop table if exists reservation cascade;
drop table if exists "table" cascade;
drop table if exists establishment cascade;
drop table if exists person cascade;



create table locality (
    city text,
    postal_code text,
    primary key (city, postal_code)
);

create table address (
    id int generated always as identity primary key,
    street text not null,
    number text not null,
    country text not null,
    locality_city text not null,
    postal_code text not null,
    foreign key (locality_city, postal_code) references locality(city, postal_code)
);

create table person (
    id int generated always as identity primary key,
    username text not null unique,
    password text not null,
    last_name text not null,
    first_name text not null,
    birth_date date not null,
    gender char not null,
    phone_number text not null unique,
    email text not null unique,
    is_positive_to_covid_19 bool,
    address_id int not null,
    foreign key (address_id) references address(id),
    check ( email like '%@%.%' )
);

create table establishment (
    id int generated always as identity primary key,
    name text not null unique,
    phone_number text not null unique,
    vat_number text unique,
    email text unique,
    category text not null,
    address_id int not null,
    foreign key (address_id) references address(id),
    check ( email like '%@%.%' )
);

create table "table" (
    id int generated always as identity,
    establishment_id int not null,
    seats_nbr int not null,
    is_outside bool not null,
    primary key (id, establishment_id),
    foreign key (establishment_id) references establishment(id) ON DELETE CASCADE,
    check (seats_nbr >= 1 and seats_nbr <= 8)
);

create table reservation (
    person_id int,
    date_time_reserved timestamptz,
    arriving_time time,
    exit_time time,
    customers_nbr int not null,
    additional_info text,
    is_cancelled bool,
    table_id int not null,
    establishment_id int not null,
    foreign key (person_id) references person(id),
    primary key (person_id, date_time_reserved),
    foreign key (table_id, establishment_id) references "table" (id, establishment_id) ON DELETE CASCADE,
    check (customers_nbr >= 1 and customers_nbr <= 8)
);

create table access_level (
    access_level text primary key,
    establishment_id int,
    foreign key (establishment_id) references establishment(id) ON DELETE CASCADE,
    check (access_level.access_level similar to 'admin|waiter%|customer')
);

create table user_access_level (
    user_id int,
    access_level text,
    foreign key (user_id) references person(id),
    foreign key (access_level) references access_level(access_level) ON DELETE CASCADE,
    primary key (user_id, access_level)
);

INSERT INTO public.locality (city, postal_code) VALUES ('Naninne', '5100');
INSERT INTO public.locality (city, postal_code) VALUES ('Wépion', '5100');
INSERT INTO public.locality (city, postal_code) VALUES ('Namur', '5000');
INSERT INTO public.locality (city, postal_code) VALUES ('5000', 'Namur');
INSERT INTO public.locality (city, postal_code) VALUES ('Jambes', '5100');

INSERT INTO public.address (street, number, country, locality_city, postal_code) VALUES ('rue des pommes', '5', 'Belgique', 'Naninne', '5100');
INSERT INTO public.address (street, number, country, locality_city, postal_code) VALUES ('rue des poire', '10', 'Belgique', 'Wépion', '5100');
INSERT INTO public.address (street, number, country, locality_city, postal_code) VALUES ('rue des kiwi', '15', 'Belgique', 'Wépion', '5100');
INSERT INTO public.address (street, number, country, locality_city, postal_code) VALUES ('rue de l Arsenal', '25', 'Belgique', 'Namur', '5000');
INSERT INTO public.address (street, number, country, locality_city, postal_code) VALUES ('rue de Bruxelles', '15', 'Belgique', 'Namur', '5000');
INSERT INTO public.address (street, number, country, locality_city, postal_code) VALUES ('rue de l''Inquiétude', '22', 'Belgique', 'Namur', '5000');
INSERT INTO public.address (street, number, country, locality_city, postal_code) VALUES ('rue des Brasseurs', '107a', 'Belgique', 'Namur', '5000');
INSERT INTO public.address (street, number, country, locality_city, postal_code) VALUES ('rue de l''Ange', '58', 'Belgique', 'Namur', '5000');
INSERT INTO public.address (street, number, country, locality_city, postal_code) VALUES ('Place de l''Ange', '30', 'Belgique', 'Namur', '5000');
INSERT INTO public.address (street, number, country, locality_city, postal_code) VALUES ('rue des Fripiers', '7', 'Belgique', 'Namur', '5000');
INSERT INTO public.address (street, number, country, locality_city, postal_code) VALUES ('rue de la Monnaie', '20', 'Belgique', 'Namur', '5000');
INSERT INTO public.address (street, number, country, locality_city, postal_code) VALUES ('rue Emile Cuvelier', '21', 'Belgique', 'Namur', '5000');
INSERT INTO public.address (street, number, country, locality_city, postal_code) VALUES ('rue de la Halle', '8', 'Belgique', 'Namur', '5000');
INSERT INTO public.address (street, number, country, locality_city, postal_code) VALUES ('Place Marché aux Légumes', '8', 'Belgique', 'Namur', '5000');
INSERT INTO public.address (street, number, country, locality_city, postal_code) VALUES ('Place Abbé Joseph André', '11', 'Belgique', 'Namur', '5000');
INSERT INTO public.address (street, number, country, locality_city, postal_code) VALUES ('Place de la Station', '21', 'Belgique', 'Namur', '5000');
INSERT INTO public.address (street, number, country, locality_city, postal_code) VALUES ('rue de Bruxelles', '39', 'Belgique', '5000', 'Namur');
INSERT INTO public.address (street, number, country, locality_city, postal_code) VALUES ('rue Lelièvre', '26', 'Belgique', 'Namur', '5000');
INSERT INTO public.address (street, number, country, locality_city, postal_code) VALUES ('rue Saint-Loup', '14', 'Belgique', 'Namur', '5000');
INSERT INTO public.address (street, number, country, locality_city, postal_code) VALUES ('rue de l''Ouvrage', '9', 'Belgique', 'Namur', '5000');
INSERT INTO public.address (street, number, country, locality_city, postal_code) VALUES ('Avenue du Bourgmestre Jean Materne', '230', 'Belgique', 'Jambes', '5100');
INSERT INTO public.address (street, number, country, locality_city, postal_code) VALUES ('Avenue du Bourgmestre Jean Materne', '179', 'Belgique', 'Jambes', '5100');
INSERT INTO public.address (street, number, country, locality_city, postal_code) VALUES ('Avenue du Bourgmestre Jean Materne', '151', 'Belgique', 'Jambes', '5100');
INSERT INTO public.address (street, number, country, locality_city, postal_code) VALUES ('Rue de Ikebukuro', '225', 'Belgique', 'Jambes', '5100');


insert into person (username, password, last_name, first_name, birth_date, gender, phone_number, email, is_positive_to_covid_19, address_id)
VALUES ('mary123', '$2b$10$GTjeVpITeh6K.Oh8oGq5NOn/Ywvd5Hnruc6HUCyfeCQF2hP6EdIW.', 'Crawley ', 'Mary', '1965-05-10', 'f', '0496395682', 'marie.crawley@gmail.com', null, 1 ); --pomme123

insert into person (username, password, last_name, first_name, birth_date, gender, phone_number, email, is_positive_to_covid_19, address_id)
VALUES ('anna123', '$2b$10$5fixCge7j6I2BLSGlQ7eV.YGrKLaK.nsdglpZ4Hg3P2etvqUUCAvK', 'Bates', 'Anna', '1963-08-18', 'm', '0489526475', 'anna.bates@hotmail.be', null, 2 ); --poire123

insert into person (username, password, last_name, first_name, birth_date, gender, phone_number, email, is_positive_to_covid_19, address_id)
VALUES ('john123', '$2b$10$7APucUJHm93.lIZYGuv.EegpIXWRu9VXKH4PfEwWzOXEScQCbiDfy', 'Bates', 'John', '1936-05-20', 'm', '0496357624', 'cora.crawley@gmail.com', null, 3 ); --kiwi123

insert into person (username, password, last_name, first_name, birth_date, gender, phone_number, email, is_positive_to_covid_19, address_id)
VALUES ('shizuo456', '$2b$10$4aRLMSnLzMAmTUrTjevq2uyBCo6pjdsM/hST7N3lWqzMMk89HVBaG', 'Heiwajima', 'Shizuo', '1979-01-28', 'm', '0496253795', 'shizuo@gmail.com', null, 24 ); --shizuo456


INSERT INTO public.establishment (name, phone_number, vat_number, email, category, address_id) VALUES ('Sams Lunch', '0495786951', 'BE9874563210', 'samslunch@restau.be', 'sandwicherie', 4);
INSERT INTO public.establishment (name, phone_number, vat_number, email, category, address_id) VALUES ('Yayami', '0123456789', 'BE3692580147', 'yayami@restau.be', 'asiatique', 5);
INSERT INTO public.establishment (name, phone_number, vat_number, email, category, address_id) VALUES ('L''ilôt pâtes', '081657125', 'BE362597555', 'ilot.pates@gmail.com', 'pâtes', 6);
INSERT INTO public.establishment (name, phone_number, vat_number, email, category, address_id) VALUES ('L''1Passetemps', '081835371', 'BE9562156255', 'impasse.temps@gmail.com', 'Brasserie', 7);
INSERT INTO public.establishment (name, phone_number, vat_number, email, category, address_id) VALUES ('Exki', '081261178', 'BE32146156', 'exki@hotmail.com', 'Frais', 8);
INSERT INTO public.establishment (name, phone_number, vat_number, email, category, address_id) VALUES ('Pizza Hut', '081260200', 'BE5432215456', 'pizza@hut.com', 'Pizza', 9);
INSERT INTO public.establishment (name, phone_number, vat_number, email, category, address_id) VALUES ('Tasty Bar & Burger', '081342907', 'BE621262593256', 'tasty.bar@burger.be', 'Burger', 10);
INSERT INTO public.establishment (name, phone_number, vat_number, email, category, address_id) VALUES ('La Cava', '081230472', 'BE6248512655', 'cava@restau.be', 'Pizza', 11);
INSERT INTO public.establishment (name, phone_number, vat_number, email, category, address_id) VALUES ('Coffee & More', '081411416', 'BE23062135622', 'coffee@more.be', 'Homemade food', 12);
INSERT INTO public.establishment (name, phone_number, vat_number, email, category, address_id) VALUES ('Le Myconos', '081231918', 'BE254625962', 'myconos@restau.be', 'Grec', 13);
INSERT INTO public.establishment (name, phone_number, vat_number, email, category, address_id) VALUES ('Café Havana', '081226336', 'BE75226816958', 'havana@bar.be', 'Bar', 14);
INSERT INTO public.establishment (name, phone_number, vat_number, email, category, address_id) VALUES ('Aux 3D - Board Game Café', '081223420', 'BE523648259', 'board.game@cafe.be', 'Bar', 15);
INSERT INTO public.establishment (name, phone_number, vat_number, email, category, address_id) VALUES ('O''Flaherty''s Irish Pub', '081344271', 'BE3254852596', 'irish@pub.be', 'Bar', 16);
INSERT INTO public.establishment (name, phone_number, vat_number, email, category, address_id) VALUES ('Barnabeer', '081523645', 'BE95148326653', 'barnabeer@bar.be', 'Bar', 17);
INSERT INTO public.establishment (name, phone_number, vat_number, email, category, address_id) VALUES ('Le Monde A l''Envers', '081223922', 'BE61822455126', 'monde-envers@bar.be', 'Bar', 18);
INSERT INTO public.establishment (name, phone_number, vat_number, email, category, address_id) VALUES ('Makimono', '0483038847', 'BE52595186355', 'makimono@restau.be', 'Sushi', 19);
INSERT INTO public.establishment (name, phone_number, vat_number, email, category, address_id) VALUES ('The Huggy''s Bar', '081263578', 'BE3151947856478', 'hubbys@bar.be', 'Burger', 20);
INSERT INTO public.establishment (name, phone_number, vat_number, email, category, address_id) VALUES ('Cat''s Corner', '081748331', 'BE469733655', 'cats@corner.be', 'Burger', 21);
INSERT INTO public.establishment (name, phone_number, vat_number, email, category, address_id) VALUES ('Le Zorba', '081303198', 'BE874122523236', 'zorba@restau.be', 'Grec', 22);
INSERT INTO public.establishment (name, phone_number, vat_number, email, category, address_id) VALUES ('Asia Express', '081300139', 'BE823562666', 'Asia@express.com', 'Asiatique', 23);

INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (1, 4, true);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (1, 6, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (2, 4, true);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (2, 6, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (2, 6, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (3, 4, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (3, 4, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (3, 4, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (3, 4, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (3, 4, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (3, 2, true);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (3, 2, true);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (3, 2, true);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (4, 4, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (4, 4, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (4, 4, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (4, 4, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (4, 4, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (4, 4, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (4, 6, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (4, 6, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (4, 6, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (4, 2, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (4, 2, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (4, 2, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (4, 2, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (5, 4, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (5, 4, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (5, 4, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (5, 4, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (5, 4, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (5, 4, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (5, 4, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (5, 4, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (5, 4, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (5, 4, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (5, 2, true);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (5, 2, true);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (5, 2, true);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (5, 2, true);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (5, 2, true);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (5, 2, true);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (6, 4, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (6, 4, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (6, 4, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (6, 4, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (6, 4, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (6, 4, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (6, 2, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (6, 2, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (7, 4, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (7, 4, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (7, 4, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (7, 4, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (7, 4, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (8, 4, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (8, 4, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (8, 4, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (8, 4, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (8, 4, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (8, 6, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (8, 6, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (9, 4, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (9, 4, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (9, 4, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (9, 4, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (9, 2, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (9, 2, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (9, 2, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (9, 2, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (9, 2, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (9, 2, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (9, 2, true);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (9, 2, true);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (9, 2, true);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (10, 6, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (10, 6, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (10, 6, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (10, 6, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (10, 6, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (10, 6, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (10, 6, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (11, 2, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (11, 2, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (11, 2, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (12, 4, true);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (12, 4, true);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (12, 4, true);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (13, 4, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (13, 4, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (13, 4, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (14, 4, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (14, 4, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (14, 4, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (15, 2, true);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (15, 2, true);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (15, 2, true);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (16, 6, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (16, 6, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (16, 6, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (17, 4, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (17, 4, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (17, 4, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (18, 2, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (18, 2, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (18, 2, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (19, 6, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (19, 6, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (19, 6, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (20, 2, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (20, 2, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (20, 2, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (20, 1, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (20, 1, false);
INSERT INTO public."table" (establishment_id, seats_nbr, is_outside) VALUES (20, 1, false);

INSERT INTO public.access_level (access_level, establishment_id) VALUES ('customer', null);
INSERT INTO public.access_level (access_level, establishment_id) VALUES ('admin', null);
INSERT INTO public.access_level (access_level, establishment_id) VALUES ('waiter_E1', 1);
INSERT INTO public.access_level (access_level, establishment_id) VALUES ('waiter_E2', 2);
INSERT INTO public.access_level (access_level, establishment_id) VALUES ('waiter_E3', 3);
INSERT INTO public.access_level (access_level, establishment_id) VALUES ('waiter_E4', 4);
INSERT INTO public.access_level (access_level, establishment_id) VALUES ('waiter_E5', 5);
INSERT INTO public.access_level (access_level, establishment_id) VALUES ('waiter_E6', 6);
INSERT INTO public.access_level (access_level, establishment_id) VALUES ('waiter_E7', 7);
INSERT INTO public.access_level (access_level, establishment_id) VALUES ('waiter_E8', 8);
INSERT INTO public.access_level (access_level, establishment_id) VALUES ('waiter_E9', 9);
INSERT INTO public.access_level (access_level, establishment_id) VALUES ('waiter_E10', 10);
INSERT INTO public.access_level (access_level, establishment_id) VALUES ('waiter_E11', 11);
INSERT INTO public.access_level (access_level, establishment_id) VALUES ('waiter_E12', 12);
INSERT INTO public.access_level (access_level, establishment_id) VALUES ('waiter_E13', 13);
INSERT INTO public.access_level (access_level, establishment_id) VALUES ('waiter_E14', 14);
INSERT INTO public.access_level (access_level, establishment_id) VALUES ('waiter_E15', 15);
INSERT INTO public.access_level (access_level, establishment_id) VALUES ('waiter_E16', 16);
INSERT INTO public.access_level (access_level, establishment_id) VALUES ('waiter_E17', 17);
INSERT INTO public.access_level (access_level, establishment_id) VALUES ('waiter_E18', 18);
INSERT INTO public.access_level (access_level, establishment_id) VALUES ('waiter_E19', 19);
INSERT INTO public.access_level (access_level, establishment_id) VALUES ('waiter_E20', 20);

insert into reservation (person_id, date_time_reserved, arriving_time, exit_time, customers_nbr, additional_info, is_cancelled, table_id, establishment_id)
VALUES (1, '2020-10-12 20:30', null, null, 4, null, null, 1, 1);

insert into reservation (person_id, date_time_reserved, arriving_time, exit_time, customers_nbr, additional_info, is_cancelled, table_id, establishment_id)
VALUES (2, '2020-11-15 19:30', null, null, 6, null, null, 4, 2);

insert into reservation (person_id, date_time_reserved, arriving_time, exit_time, customers_nbr, additional_info, is_cancelled, table_id, establishment_id)
VALUES (2, '2020-05-26 21:30', null, null, 2, null, null, 3, 2);

insert into user_access_level (user_id, access_level) VALUES ( 1, 'admin' );
insert into user_access_level (user_id, access_level) VALUES ( 1, 'customer' );
insert into user_access_level (user_id, access_level) VALUES ( 2, 'customer' );
insert into user_access_level (user_id, access_level) VALUES ( 3, 'customer' );
insert into user_access_level (user_id, access_level) VALUES ( 3, 'waiter_E1' );
insert into user_access_level (user_id, access_level) VALUES ( 4, 'customer' );
insert into user_access_level (user_id, access_level) VALUES ( 4, 'waiter_E10' );