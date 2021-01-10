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


INSERT INTO locality (city, postal_code) VALUES ('Jambes', '5100');
insert into locality (city, postal_code) values ('Naninne', '5100');
insert into locality (city, postal_code) values ('Wépion', '5100');
insert into locality (city, postal_code) values ('Namur', '5000');
insert into locality (city, postal_code) values ('Royaume de Logres', 'NE1PG');
insert into locality (city, postal_code) values ('Varsovie', '03-301');
insert into locality (city, postal_code) values ('Tokyo ', '106-8007');
insert into locality (city, postal_code) values ('British Columbia', 'V5K');
insert into locality (city, postal_code) values ('Québec', 'H2T 1S6');
insert into locality (city, postal_code) values ('Toussaint', '2016');
insert into locality (city, postal_code) values ('Atreval', '2057');
insert into locality (city, postal_code) values ('Tristram', '2012');
insert into locality (city, postal_code) values ('Koprulu', '2569');
insert into locality (city, postal_code) values ('Ottignies', '1348');
insert into locality (city, postal_code) values ('Twin Peaks', '1652');
INSERT INTO locality (city, postal_code) VALUES ('Fosses-la-Ville', '5070');
INSERT INTO locality (city, postal_code) VALUES ('Namur', '5001');
INSERT INTO locality (city, postal_code) VALUES ('Malonne', '5020');
INSERT INTO locality (city, postal_code) VALUES ('Charleroi', '6200');
INSERT INTO locality (city, postal_code) VALUES ('Martigues', '13500');
INSERT INTO locality (city, postal_code) VALUES ('Arbre', '5170');
INSERT INTO locality (city, postal_code) VALUES ('Tokyo', '102-8002');
INSERT INTO locality (city, postal_code) VALUES ('Île déserte Nook Inc', '0001');
INSERT INTO locality (city, postal_code) VALUES ('Namur', '5002');


INSERT INTO address (street, number, country, locality_city, postal_code) VALUES ('rue des pommes', '5', 'Belgique', 'Naninne', '5100');
INSERT INTO address (street, number, country, locality_city, postal_code) VALUES ('rue des poire', '10', 'Belgique', 'Wépion', '5100');
INSERT INTO address (street, number, country, locality_city, postal_code) VALUES ('rue des kiwi', '15', 'Belgique', 'Wépion', '5100');
INSERT INTO address (street, number, country, locality_city, postal_code) VALUES ('rue de l''Arsenal', '25', 'Belgique', 'Namur', '5000');
INSERT INTO address (street, number, country, locality_city, postal_code) VALUES ('rue de Bruxelles', '15', 'Belgique', 'Namur', '5000');
INSERT INTO address (street, number, country, locality_city, postal_code) VALUES ('rue de l''Inquiétude', '22', 'Belgique', 'Namur', '5000');
INSERT INTO address (street, number, country, locality_city, postal_code) VALUES ('rue des Brasseurs', '107a', 'Belgique', 'Namur', '5000');
INSERT INTO address (street, number, country, locality_city, postal_code) VALUES ('rue de l''Ange', '58', 'Belgique', 'Namur', '5000');
INSERT INTO address (street, number, country, locality_city, postal_code) VALUES ('Place de l''Ange', '30', 'Belgique', 'Namur', '5000');
INSERT INTO address (street, number, country, locality_city, postal_code) VALUES ('rue des Fripiers', '7', 'Belgique', 'Namur', '5000');
INSERT INTO address (street, number, country, locality_city, postal_code) VALUES ('rue de la Monnaie', '20', 'Belgique', 'Namur', '5000');
INSERT INTO address (street, number, country, locality_city, postal_code) VALUES ('rue Emile Cuvelier', '21', 'Belgique', 'Namur', '5000');
INSERT INTO address (street, number, country, locality_city, postal_code) VALUES ('rue de la Halle', '8', 'Belgique', 'Namur', '5000');
INSERT INTO address (street, number, country, locality_city, postal_code) VALUES ('Place Marché aux Légumes', '8', 'Belgique', 'Namur', '5000');
INSERT INTO address (street, number, country, locality_city, postal_code) VALUES ('Place Abbé Joseph André', '11', 'Belgique', 'Namur', '5000');
INSERT INTO address (street, number, country, locality_city, postal_code) VALUES ('Place de la Station', '21', 'Belgique', 'Namur', '5000');
INSERT INTO address (street, number, country, locality_city, postal_code) VALUES ('rue de Bruxelles', '39', 'Belgique', 'Namur', '5000');
INSERT INTO address (street, number, country, locality_city, postal_code) VALUES ('rue Lelièvre', '26', 'Belgique', 'Namur', '5000');
INSERT INTO address (street, number, country, locality_city, postal_code) VALUES ('rue Saint-Loup', '14', 'Belgique', 'Namur', '5000');
INSERT INTO address (street, number, country, locality_city, postal_code) VALUES ('rue de l''Ouvrage', '9', 'Belgique', 'Namur', '5000');
INSERT INTO address (street, number, country, locality_city, postal_code) VALUES ('Avenue du Bourgmestre Jean Materne', '230', 'Belgique', 'Jambes', '5100');
INSERT INTO address (street, number, country, locality_city, postal_code) VALUES ('Avenue du Bourgmestre Jean Materne', '179', 'Belgique', 'Jambes', '5100');
INSERT INTO address (street, number, country, locality_city, postal_code) VALUES ('Avenue du Bourgmestre Jean Materne', '151', 'Belgique', 'Jambes', '5100');
INSERT INTO address (street, number, country, locality_city, postal_code) VALUES ('Rue de Ikebukuro', '225', 'Belgique', 'Jambes', '5100');
insert into address (street, number, country, locality_city, postal_code) values ('Val des Rois', '12', 'Belgique', 'Wépion', '5100');
insert into address (street, number, country, locality_city, postal_code) values ('Rue des Dieux', '1', 'Belgique', 'Namur', '5000');
insert into address (street, number, country, locality_city, postal_code) values ('Val des Rois', '15', 'Belgique', 'Wépion', '5100');
insert into address (street, number, country, locality_city, postal_code) values ('Tienne aux Clochers', '49', 'Belgique', 'Wépion', '5100');
insert into address (street, number, country, locality_city, postal_code) values ('Avenue de la Chimay Bleue', '1', 'Belgique', 'Namur', '5000');
insert into address (street, number, country, locality_city, postal_code) values ('Avenue de la Chimay Bleue', '2', 'Belgique', 'Namur', '5000');
insert into address (street, number, country, locality_city, postal_code) values ('Rue des Dieux', '1bis', 'Belgique', 'Namur', '5000');
insert into address (street, number, country, locality_city, postal_code) values ('Route de Kaamelott', '1', 'Bretagne', 'Royaume de Logres', 'NE1PG');
insert into address (street, number, country, locality_city, postal_code) values ('Jagiellońska', '74E', 'Pologne', 'Varsovie', '03-301');
insert into address (street, number, country, locality_city, postal_code) values ('Rue du Château Roswaal', '1', 'Japan', 'Tokyo ', '106-8007');
insert into address (street, number, country, locality_city, postal_code) values ('Mont Celeste', '1', 'Canada', 'British Columbia', 'V5K');
insert into address (street, number, country, locality_city, postal_code) values ('Boulevard Saint-Laurent', '5505', 'Canada', 'Québec', 'H2T 1S6');
insert into address (street, number, country, locality_city, postal_code) values ('Domaine de Beauclair', '1', 'Duvin', 'Toussaint', '2016');
insert into address (street, number, country, locality_city, postal_code) values ('Place de la Lumière', '1', 'Azeroth', 'Atreval', '2057');
insert into address (street, number, country, locality_city, postal_code) values ('Val du Mort', '12', 'Khanduras', 'Tristram', '2012');
insert into address (street, number, country, locality_city, postal_code) values ('Rue de TarKossia', '1', 'Solar', 'Koprulu', '2569');
insert into address (street, number, country, locality_city, postal_code) values ('Champ Vallée', '5', 'Belgique', 'Ottignies', '1348');
insert into address (street, number, country, locality_city, postal_code) values ('Salt Lake ', '50', 'USA', 'Twin Peaks', '1652');
insert into address (street, number, country, locality_city, postal_code) values ('Rue d''Arquet', '22', 'Belgique', 'Namur', '5000');
INSERT INTO address (street, number, country, locality_city, postal_code) VALUES ('Rue Saint Remy', '4', 'Belgique', 'Fosses-la-Ville', '5070');
INSERT INTO address (street, number, country, locality_city, postal_code) VALUES ('Avenue Joseph Abras', '36', 'Belgique', 'Namur', '5001');
INSERT INTO address (street, number, country, locality_city, postal_code) VALUES ('Fond de Malonne', '121', 'Belgique', 'Malonne', '5020');
INSERT INTO address (street, number, country, locality_city, postal_code) VALUES ('Rue de la Roux-manie', '1', 'Belgique', 'Charleroi', '6200');
INSERT INTO address (street, number, country, locality_city, postal_code) VALUES ('Route des Ventrons', '1', 'France', 'Martigues', '13500');
INSERT INTO address (street, number, country, locality_city, postal_code) VALUES ('Chemin de la Roseraie', '9', 'Belgique', 'Wépion', '5100');
INSERT INTO address (street, number, country, locality_city, postal_code) VALUES ('Rue de l''Ecole', '1', 'Belgique', 'Arbre', '5170');
INSERT INTO address (street, number, country, locality_city, postal_code) VALUES ('Kojimachi', '1-12', 'Japon', 'Tokyo', '102-8002');
INSERT INTO address (street, number, country, locality_city, postal_code) VALUES ('Place de l''Île', '1', 'Inconnu', 'Île déserte Nook Inc', '0001');
INSERT INTO address (street, number, country, locality_city, postal_code) VALUES ('Route de Saint-Gérard', '229', 'Belgique', 'Wépion', '5100');
INSERT INTO address (street, number, country, locality_city, postal_code) VALUES ('Rue de la Pépinière', '106A', 'Belgique', 'Namur', '5002');


insert into person (username, password, last_name, first_name, birth_date, gender, phone_number, email, is_positive_to_covid_19, address_id) VALUES ('mary123', '$2b$10$GTjeVpITeh6K.Oh8oGq5NOn/Ywvd5Hnruc6HUCyfeCQF2hP6EdIW.', 'Crawley ', 'Mary', '1965-05-10', 'f', '0496395682', 'marie.crawley@gmail.com', false, 1 ); --pomme123
insert into person (username, password, last_name, first_name, birth_date, gender, phone_number, email, is_positive_to_covid_19, address_id) VALUES ('anna123', '$2b$10$5fixCge7j6I2BLSGlQ7eV.YGrKLaK.nsdglpZ4Hg3P2etvqUUCAvK', 'Bates', 'Anna', '1963-08-18', 'm', '0489526475', 'anna.bates@hotmail.be',false, 2 ); --poire123
insert into person (username, password, last_name, first_name, birth_date, gender, phone_number, email, is_positive_to_covid_19, address_id) VALUES ('john123', '$2b$10$7APucUJHm93.lIZYGuv.EegpIXWRu9VXKH4PfEwWzOXEScQCbiDfy', 'Bates', 'John', '1936-05-20', 'm', '0496357624', 'cora.crawley@gmail.com', false, 3 ); --kiwi123
insert into person (username, password, last_name, first_name, birth_date, gender, phone_number, email, is_positive_to_covid_19, address_id) VALUES ('shizuo456', '$2b$10$4aRLMSnLzMAmTUrTjevq2uyBCo6pjdsM/hST7N3lWqzMMk89HVBaG', 'Heiwajima', 'Shizuo', '1979-01-28', 'm', '0496253795', 'shizuo@gmail.com', false, 24 ); --shizuo456
insert into person (username, password, last_name, first_name, birth_date, gender, phone_number, email, is_positive_to_covid_19, address_id) values ('drakexorn', '$2b$10$azieedal5tP9iu68ss4ffe/RIxPQ2DOFGPJH9jIdokHl2OCCBWdoW', 'Bernard', 'Christophe', '2000-01-10', 'M', '0471124035', 'drakexorn@gmail.com', false, 25);
insert into person (username, password, last_name, first_name, birth_date, gender, phone_number, email, is_positive_to_covid_19, address_id) values ('hunteroi', '$2b$10$VNk.AQ7fGMYMqdLQPT458OEUbcSASHq0v062oMv7ZNckf4L9OM4ma', 'Devresse', 'Tinaël', '1999-03-21', 'M', '+32498606060', 'me@tinaeldevresse.eu', false, 26);
insert into person (username, password, last_name, first_name, birth_date, gender, phone_number, email, is_positive_to_covid_19, address_id) values ('ebdrd_15', '$2b$10$6PM4H7ze0YP1aegddgBdyefE1uqqOnHy8kkUr3AvjgZgDBbXeFDd6', 'Badard', 'Eric', '1955-12-15', 'M', '0479825649', 'ericbadard@gmail.com', false, 27);
insert into person (username, password, last_name, first_name, birth_date, gender, phone_number, email, is_positive_to_covid_19, address_id) values ('jeansw0812', '$2b$10$6bO9oFpdeQhxyip81ZKOo.X6TBXsLpL95d6XnoFuhvZ3iR.YTHO02', 'Swartelé', 'Jean', '1939-09-15', 'M', '081461389', 'jeanswartele@gmail.com', false, 28);
insert into person (username, password, last_name, first_name, birth_date, gender, phone_number, email, is_positive_to_covid_19, address_id) values ('dalvyn', '$2b$10$DKOZlWBsu1WMlDlGFaoyLu3AGtmF74vJjORInx8/guG6/m6ESqmvm', 'Kingmaker', 'Dalvyn', '1982-12-03', 'M', '0478526594', 'dalvyn@pathfinder.com', false, 29);
insert into person (username, password, last_name, first_name, birth_date, gender, phone_number, email, is_positive_to_covid_19, address_id) values ('cpirotte', '$2b$10$MOBzawaXIqaUNc5UdlH0Lu2.yc49n0MYMFh44vR59xDwdmtlNwfpO', 'Pirotte', 'Cécile', '1983-07-07', 'F', '0477665585', 'cecile.pirotte@henallux.be', false, 30);
insert into person (username, password, last_name, first_name, birth_date, gender, phone_number, email, is_positive_to_covid_19, address_id) values ('seten_taisei', '$2b$10$Uh08Tqdq1av0UKyKedcaoOK1fxAmFJwdfoz4iLFc4NnBaEkx3um46', 'Chubaka', 'Romain', '1998-04-14', 'M', '0470557834', 'ros@odoo.com', false, 31);
insert into person (username, password, last_name, first_name, birth_date, gender, phone_number, email, is_positive_to_covid_19, address_id) values ('roi_arthur_de_bretage', '$2b$10$B4FXjB./4D5YqD0g3GOTxe5msHwkCv9QYAaMHf.IUgmUwVnocCo2a', 'Pandragon', 'Arthur', '1974-06-16', 'M', '00335529546', 'arthurus@legionromaine.it', false, 32);
insert into person (username, password, last_name, first_name, birth_date, gender, phone_number, email, is_positive_to_covid_19, address_id) values ('jsilverhand', '$2b$10$3XtiE5xWTGjQq02vM2mKDOIyuEhm13v9PyJs/djC0MVpMZGb0vGEq', 'Reeves', 'Keanu', '1964-09-02', 'M', '0048225196900', 'johnny.silverhand@cdprojektred.com', false, 33);
insert into person (username, password, last_name, first_name, birth_date, gender, phone_number, email, is_positive_to_covid_19, address_id) values ('natsusu', '$2b$10$6G4hoou4swyhnsvEjalfNuCz2fcTrr9aCMyYZq/c6nVI7/VVhB6dO', 'Natsuki', 'Subaru', '1997-10-22', 'M', '00815649812', 'subarunatsuki@rezero.jp', false, 34);
insert into person (username, password, last_name, first_name, birth_date, gender, phone_number, email, is_positive_to_covid_19, address_id) values ('madeline', '$2b$10$H7xalShuQkdlVilBVjj9tuf3Qn8sSKrBe4iIUBho9.qGZeuO21/tm', 'Celeste', 'Madeline', '1995-01-12', 'F', '0015962483', 'madeline@celeste.ca', false, 35);
insert into person (username, password, last_name, first_name, birth_date, gender, phone_number, email, is_positive_to_covid_19, address_id) values ('croft05', '$2b$10$DidX66qynt7ahUl.2S9N4ekAwc1Ocre/LYnZNyMBuutZ/lG1CZE4a', 'Croft', 'Lara', '1996-10-25', 'F', '0015144902000', 'lara@ubisoft.com', false, 36);
insert into person (username, password, last_name, first_name, birth_date, gender, phone_number, email, is_positive_to_covid_19, address_id) values ('gerard2rive', '$2b$10$PHZUFZkN8KROTl2PoQ2em.umBhNIx6AjjcOWOqo1axF.pfkqcL0o2', 'Gérard', 'De Rive', '1987-02-12', 'M', '0484705506', 'gerardderive@outlook.be', false, 37);
insert into person (username, password, last_name, first_name, birth_date, gender, phone_number, email, is_positive_to_covid_19, address_id) values ('fordringt', '$2b$10$4yNVACNK054EDITUE9U6Fe0pDX.sv6Gw3pUwX3NLhZq7O92gUHDs2', 'Tirion', 'Fordring', '1957-09-05', 'M', '089562658', 'tirionfordring@hotmail.fr', false, 38);
insert into person (username, password, last_name, first_name, birth_date, gender, phone_number, email, is_positive_to_covid_19, address_id) values ('xxdemonhunterxx', '$2b$10$PGDRynGykXlixw3KtLNm4u47cAEeldVg3VwOcyJYNTzyW23j8//Cm', 'Valla', 'Hatred', '1996-05-14', 'F', '0478700717', 'Va11a@hotmail.fr', false, 39);
insert into person (username, password, last_name, first_name, birth_date, gender, phone_number, email, is_positive_to_covid_19, address_id) values ('queenofblades', '$2b$10$tCMWy.v5cg0/KzefiyXvoe5AXgdnVbKCZ2m6zR0nctwbSrNq7Zb32', 'Sarah', 'Kerrigan', '1997-06-03', 'F', '084759865', 'kerrigans@outlook.be', false, 40);
insert into person (username, password, last_name, first_name, birth_date, gender, phone_number, email, is_positive_to_covid_19, address_id) values ('archenemy', '$2b$10$II1nkWCwlwBlJ.f9U9pGR.xP98jmdUgLd/b2RvyrektNJyYkJ9T7C', 'Alissa', 'White-Gluz', '1985-07-31', 'F', '082569878', 'alissawg@outlook.fr', false, 41);
insert into person (username, password, last_name, first_name, birth_date, gender, phone_number, email, is_positive_to_covid_19, address_id) values ('secretagentcooper', '$2b$10$sQwqbGElv7UMOMNZSx0GpO6mIIk8nu8oN9.SvxNkEGS5h0mg71YUa', 'Dale', 'Cooper', '1954-04-19', 'M', '086321545', 'cooper@fbi.us', false, 42);
insert into person (username, password, last_name, first_name, birth_date, gender, phone_number, email, is_positive_to_covid_19, address_id) values ('joecloclo', '$2b$10$gz2x7yGiP7U2demZhd8YAeEO8tAetyKDpRfR1wonfeG/DBEKJJ41i', 'L''Clodo', 'Joe', '1962-09-26', 'M', '0476852951', 'joeclodo@sdf.be', false, 43);
INSERT INTO person (username, password, last_name, first_name, birth_date, gender, phone_number, email, is_positive_to_covid_19, address_id) VALUES ('ryan711', '$2b$10$9lsKrHH10WvdudrdpQDonOKyLEmetOZCsKNdp/hxYYv.XHyo7c0WW', 'Cheron', 'Ryan', '2000-05-17', 'M', '0495898676', 'ryan.cheron@gmail.com', false, 45);
INSERT INTO person (username, password, last_name, first_name, birth_date, gender, phone_number, email, is_positive_to_covid_19, address_id) VALUES ('chrichridlfg', '$2b$10$7q3xAZmUnvcTMRfPrs0/m./TrxBuLR33BnciAVZRgE.KQsOMc/uf2', 'Delforge', 'Christina', '1999-03-02', 'F', '0497676447', 'chrisdlfg@hotmail.com', false, 46);
INSERT INTO person (username, password, last_name, first_name, birth_date, gender, phone_number, email, is_positive_to_covid_19, address_id) VALUES ('lennzuroux', '$2b$10$yzR7sg6zUlsRPGhcHL1ZYOMtTsYzrzs7TU6u.Vgef9Q0KU.CzPW1u', 'Wilderiane', 'Maxime', '1997-10-28', 'M', '0472659135', 'maximewilde@gmail.com', false, 47);
INSERT INTO person (username, password, last_name, first_name, birth_date, gender, phone_number, email, is_positive_to_covid_19, address_id) VALUES ('marcow', '$2b$10$cXFx9VfzRJeo3T/TEuLiPuT5cSFUPAY4BFPeGGVi1MCBnC4it/g8u', 'Martinez', 'Marc-Anthony', '1994-01-14', 'M', '0033660746636', 'martinez.marc13500@gmail.com', false, 48);
INSERT INTO person (username, password, last_name, first_name, birth_date, gender, phone_number, email, is_positive_to_covid_19, address_id) VALUES ('spartanix', '$2b$10$Djb1T9g65Qq5g7duySEWdeFnGtAm8/vsk5XqSs9MDiNozOeRckmr6', 'Marchal', 'Lucas', '2000-11-22', 'M', '0471250644', 'lucas.marchal2@hotmail.com', false, 49);
INSERT INTO person (username, password, last_name, first_name, birth_date, gender, phone_number, email, is_positive_to_covid_19, address_id) VALUES ('herionj', '$2b$10$9ndcK9QfKfBWLXfWabzY5OtC1fJ7jTmrUB09CvrD4laDFuK.F0giO', 'Hérion', 'Jaina', '1999-08-26', 'O', '0479886337', 'jaina.herion@hotmail.com', false, 50);
INSERT INTO person (username, password, last_name, first_name, birth_date, gender, phone_number, email, is_positive_to_covid_19, address_id) VALUES ('gluthos', '$2b$10$t3VhDl4yg2WhL/2UWz.MousJlWOLt1LfliuapwDgIWOdfoq/n7A66', 'Hennin', 'Augustin', '1996-12-27', 'M', '0491523193', 'augustin.hennin@henallux.be', false, 44);
INSERT INTO person (username, password, last_name, first_name, birth_date, gender, phone_number, email, is_positive_to_covid_19, address_id) VALUES ('mikaot', '$2b$10$0u7s9KMvjk0Rk.23ds1oH.QaOSy/pkW8plVsiNu9RQQJ0tBmmkxFK', 'Ackerman', 'Mikasa', '1998-04-17', 'F', '0081', 'mikasa@aot.com', false, 51);
INSERT INTO person (username, password, last_name, first_name, birth_date, gender, phone_number, email, is_positive_to_covid_19, address_id) VALUES ('tnook$$', '$2b$10$1Og2H7ABbY1aFv.5fmtVzeYutyrpRLaft9SabGEFJdhzmgOQXXfZC', 'Nook', 'Tom', '1976-05-30', 'M', '0496523349', 'tom@nook.inc', false, 52);
INSERT INTO person (username, password, last_name, first_name, birth_date, gender, phone_number, email, is_positive_to_covid_19, address_id) VALUES ('slefranc', '$2b$10$2GIR.qf7BzhDsVAAnkzY/OboeW0svKa.bGHvD1.NgyPfGl/i7C6/O', 'Lefranc', 'Sandra', '2000-10-31', 'F', '0476773768', 'sandra.lefranc@gmail.com', false, 53);
INSERT INTO person (username, password, last_name, first_name, birth_date, gender, phone_number, email, is_positive_to_covid_19, address_id) VALUES ('bertauxf38', '$2b$10$O52Z.Fp0sWj887LRWbvYy.trsdge9vEoGTmZ2QWU5G6HSxfrY2vH6', 'Bertaux', 'Florine', '1999-09-10', 'F', '0476591346', 'florine.bertaux@henallux.be', false, 54);


INSERT INTO establishment (name, phone_number, vat_number, email, category, address_id) VALUES ('Sams Lunch', '0495786951', 'BE9874563210', 'samslunch@restau.be', 'sandwicherie', 4);
INSERT INTO establishment (name, phone_number, vat_number, email, category, address_id) VALUES ('Yayami', '0123456789', 'BE3692580147', 'yayami@restau.be', 'asiatique', 5);
INSERT INTO establishment (name, phone_number, vat_number, email, category, address_id) VALUES ('L''ilôt pâtes', '081657125', 'BE362597555', 'ilot.pates@gmail.com', 'pâtes', 6);
INSERT INTO establishment (name, phone_number, vat_number, email, category, address_id) VALUES ('L''1Passetemps', '081835371', 'BE9562156255', 'impasse.temps@gmail.com', 'Brasserie', 7);
INSERT INTO establishment (name, phone_number, vat_number, email, category, address_id) VALUES ('Exki', '081261178', 'BE32146156', 'exki@hotmail.com', 'Frais', 8);
INSERT INTO establishment (name, phone_number, vat_number, email, category, address_id) VALUES ('Pizza Hut', '081260200', 'BE5432215456', 'pizza@hut.com', 'Pizza', 9);
INSERT INTO establishment (name, phone_number, vat_number, email, category, address_id) VALUES ('Tasty Bar & Burger', '081342907', 'BE621262593256', 'tasty.bar@burger.be', 'Burger', 10);
INSERT INTO establishment (name, phone_number, vat_number, email, category, address_id) VALUES ('La Cava', '081230472', 'BE6248512655', 'cava@restau.be', 'Pizza', 11);
INSERT INTO establishment (name, phone_number, vat_number, email, category, address_id) VALUES ('Coffee & More', '081411416', 'BE23062135622', 'coffee@more.be', 'Homemade food', 12);
INSERT INTO establishment (name, phone_number, vat_number, email, category, address_id) VALUES ('Le Myconos', '081231918', 'BE254625962', 'myconos@restau.be', 'Grec', 13);
INSERT INTO establishment (name, phone_number, vat_number, email, category, address_id) VALUES ('Café Havana', '081226336', 'BE75226816958', 'havana@bar.be', 'Bar', 14);
INSERT INTO establishment (name, phone_number, vat_number, email, category, address_id) VALUES ('Aux 3D - Board Game Café', '081223420', 'BE523648259', 'board.game@cafe.be', 'Bar', 15);
INSERT INTO establishment (name, phone_number, vat_number, email, category, address_id) VALUES ('O''Flaherty''s Irish Pub', '081344271', 'BE3254852596', 'irish@pub.be', 'Bar', 16);
INSERT INTO establishment (name, phone_number, vat_number, email, category, address_id) VALUES ('Barnabeer', '081523645', 'BE95148326653', 'barnabeer@bar.be', 'Bar', 17);
INSERT INTO establishment (name, phone_number, vat_number, email, category, address_id) VALUES ('Le Monde A l''Envers', '081223922', 'BE61822455126', 'monde-envers@bar.be', 'Bar', 18);
INSERT INTO establishment (name, phone_number, vat_number, email, category, address_id) VALUES ('Makimono', '0483038847', 'BE52595186355', 'makimono@restau.be', 'Sushi', 19);
INSERT INTO establishment (name, phone_number, vat_number, email, category, address_id) VALUES ('The Huggy''s Bar', '081263578', 'BE3151947856478', 'hubbys@bar.be', 'Burger', 20);
INSERT INTO establishment (name, phone_number, vat_number, email, category, address_id) VALUES ('Cat''s Corner', '081748331', 'BE469733655', 'cats@corner.be', 'Burger', 21);
INSERT INTO establishment (name, phone_number, vat_number, email, category, address_id) VALUES ('Le Zorba', '081303198', 'BE874122523236', 'zorba@restau.be', 'Grec', 22);
INSERT INTO establishment (name, phone_number, vat_number, email, category, address_id) VALUES ('Asia Express', '081300139', 'BE823562666', 'Asia@express.com', 'Asiatique', 23);


INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (1, 4, true);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (1, 6, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (2, 4, true);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (2, 6, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (2, 6, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (3, 4, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (3, 4, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (3, 4, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (3, 4, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (3, 4, false); --10
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (3, 2, true);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (3, 2, true);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (3, 2, true);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (4, 4, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (4, 4, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (4, 4, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (4, 4, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (4, 4, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (4, 4, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (4, 6, false); --20
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (4, 6, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (4, 6, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (4, 2, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (4, 2, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (4, 2, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (4, 2, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (5, 4, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (5, 4, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (5, 4, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (5, 4, false); --30
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (5, 4, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (5, 4, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (5, 4, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (5, 4, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (5, 4, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (5, 4, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (5, 2, true);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (5, 2, true);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (5, 2, true);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (5, 2, true);--40
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (5, 2, true);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (5, 2, true);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (6, 4, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (6, 4, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (6, 4, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (6, 4, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (6, 4, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (6, 4, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (6, 2, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (6, 2, false);--50
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (7, 4, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (7, 4, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (7, 4, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (7, 4, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (7, 4, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (8, 4, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (8, 4, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (8, 4, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (8, 4, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (8, 4, false);--60
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (8, 6, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (8, 6, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (9, 4, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (9, 4, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (9, 4, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (9, 4, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (9, 2, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (9, 2, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (9, 2, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (9, 2, false);--70
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (9, 2, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (9, 2, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (9, 2, true);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (9, 2, true);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (9, 2, true);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (10, 6, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (10, 6, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (10, 6, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (10, 6, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (10, 6, false);--80
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (10, 6, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (10, 6, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (11, 2, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (11, 2, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (11, 2, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (12, 4, true);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (12, 4, true);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (12, 4, true);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (13, 4, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (13, 4, false);--90
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (13, 4, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (14, 4, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (14, 4, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (14, 4, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (15, 2, true);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (15, 2, true);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (15, 2, true);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (16, 6, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (16, 6, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (16, 6, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (17, 4, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (17, 4, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (17, 4, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (18, 2, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (18, 2, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (18, 2, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (19, 6, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (19, 6, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (19, 6, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (20, 2, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (20, 2, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (20, 2, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (20, 1, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (20, 1, false);
INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES (20, 1, false);


INSERT INTO access_level (access_level, establishment_id) VALUES ('customer', null);
INSERT INTO access_level (access_level, establishment_id) VALUES ('admin', null);
INSERT INTO access_level (access_level, establishment_id) VALUES ('waiter_E1', 1);
INSERT INTO access_level (access_level, establishment_id) VALUES ('waiter_E2', 2);
INSERT INTO access_level (access_level, establishment_id) VALUES ('waiter_E3', 3);
INSERT INTO access_level (access_level, establishment_id) VALUES ('waiter_E4', 4);
INSERT INTO access_level (access_level, establishment_id) VALUES ('waiter_E5', 5);
INSERT INTO access_level (access_level, establishment_id) VALUES ('waiter_E6', 6);
INSERT INTO access_level (access_level, establishment_id) VALUES ('waiter_E7', 7);
INSERT INTO access_level (access_level, establishment_id) VALUES ('waiter_E8', 8);
INSERT INTO access_level (access_level, establishment_id) VALUES ('waiter_E9', 9);
INSERT INTO access_level (access_level, establishment_id) VALUES ('waiter_E10', 10);
INSERT INTO access_level (access_level, establishment_id) VALUES ('waiter_E11', 11);
INSERT INTO access_level (access_level, establishment_id) VALUES ('waiter_E12', 12);
INSERT INTO access_level (access_level, establishment_id) VALUES ('waiter_E13', 13);
INSERT INTO access_level (access_level, establishment_id) VALUES ('waiter_E14', 14);
INSERT INTO access_level (access_level, establishment_id) VALUES ('waiter_E15', 15);
INSERT INTO access_level (access_level, establishment_id) VALUES ('waiter_E16', 16);
INSERT INTO access_level (access_level, establishment_id) VALUES ('waiter_E17', 17);
INSERT INTO access_level (access_level, establishment_id) VALUES ('waiter_E18', 18);
INSERT INTO access_level (access_level, establishment_id) VALUES ('waiter_E19', 19);
INSERT INTO access_level (access_level, establishment_id) VALUES ('waiter_E20', 20);


INSERT INTO user_access_level (user_id, access_level) VALUES (1, 'admin');
INSERT INTO user_access_level (user_id, access_level) VALUES (1, 'customer');
INSERT INTO user_access_level (user_id, access_level) VALUES (2, 'customer');
INSERT INTO user_access_level (user_id, access_level) VALUES (3, 'customer');
INSERT INTO user_access_level (user_id, access_level) VALUES (3, 'waiter_E1');
INSERT INTO user_access_level (user_id, access_level) VALUES (4, 'customer');
INSERT INTO user_access_level (user_id, access_level) VALUES (4, 'waiter_E10');
INSERT INTO user_access_level (user_id, access_level) VALUES (5, 'customer');
INSERT INTO user_access_level (user_id, access_level) VALUES (5, 'waiter_E1');
INSERT INTO user_access_level (user_id, access_level) VALUES (6, 'customer');
INSERT INTO user_access_level (user_id, access_level) VALUES (6, 'waiter_E2');
INSERT INTO user_access_level (user_id, access_level) VALUES (7, 'customer');
INSERT INTO user_access_level (user_id, access_level) VALUES (8, 'customer');
INSERT INTO user_access_level (user_id, access_level) VALUES (8, 'waiter_E2');
INSERT INTO user_access_level (user_id, access_level) VALUES (9, 'customer');
INSERT INTO user_access_level (user_id, access_level) VALUES (9, 'waiter_E3');
INSERT INTO user_access_level (user_id, access_level) VALUES (10, 'customer');
INSERT INTO user_access_level (user_id, access_level) VALUES (10, 'waiter_E3');
INSERT INTO user_access_level (user_id, access_level) VALUES (11, 'customer');
INSERT INTO user_access_level (user_id, access_level) VALUES (11, 'waiter_E4');
INSERT INTO user_access_level (user_id, access_level) VALUES (12, 'customer');
INSERT INTO user_access_level (user_id, access_level) VALUES (12, 'waiter_E4');
INSERT INTO user_access_level (user_id, access_level) VALUES (13, 'customer');
INSERT INTO user_access_level (user_id, access_level) VALUES (13, 'waiter_E5');
INSERT INTO user_access_level (user_id, access_level) VALUES (14, 'customer');
INSERT INTO user_access_level (user_id, access_level) VALUES (14, 'waiter_E5');
INSERT INTO user_access_level (user_id, access_level) VALUES (15, 'customer');
INSERT INTO user_access_level (user_id, access_level) VALUES (15, 'waiter_E6');
INSERT INTO user_access_level (user_id, access_level) VALUES (16, 'customer');
INSERT INTO user_access_level (user_id, access_level) VALUES (16, 'waiter_E6');
INSERT INTO user_access_level (user_id, access_level) VALUES (17, 'customer');
INSERT INTO user_access_level (user_id, access_level) VALUES (17, 'waiter_E7');
INSERT INTO user_access_level (user_id, access_level) VALUES (18, 'customer');
INSERT INTO user_access_level (user_id, access_level) VALUES (18, 'waiter_E7');
INSERT INTO user_access_level (user_id, access_level) VALUES (19, 'customer');
INSERT INTO user_access_level (user_id, access_level) VALUES (19, 'waiter_E8');
INSERT INTO user_access_level (user_id, access_level) VALUES (20, 'customer');
INSERT INTO user_access_level (user_id, access_level) VALUES (20, 'waiter_E8');
INSERT INTO user_access_level (user_id, access_level) VALUES (21, 'customer');
INSERT INTO user_access_level (user_id, access_level) VALUES (21, 'waiter_E9');
INSERT INTO user_access_level (user_id, access_level) VALUES (22, 'customer');
INSERT INTO user_access_level (user_id, access_level) VALUES (22, 'waiter_E9');
INSERT INTO user_access_level (user_id, access_level) VALUES (23, 'customer');
INSERT INTO user_access_level (user_id, access_level) VALUES (23, 'waiter_E10');
INSERT INTO user_access_level (user_id, access_level) VALUES (24, 'customer');
INSERT INTO user_access_level (user_id, access_level) VALUES (24, 'waiter_E14');
INSERT INTO user_access_level (user_id, access_level) VALUES (25, 'customer');
INSERT INTO user_access_level (user_id, access_level) VALUES (26, 'customer');
INSERT INTO user_access_level (user_id, access_level) VALUES (27, 'customer');
INSERT INTO user_access_level (user_id, access_level) VALUES (27, 'waiter_E19');
INSERT INTO user_access_level (user_id, access_level) VALUES (28, 'customer');
INSERT INTO user_access_level (user_id, access_level) VALUES (28, 'waiter_E20');
INSERT INTO user_access_level (user_id, access_level) VALUES (29, 'customer');
INSERT INTO user_access_level (user_id, access_level) VALUES (29, 'waiter_E19');
INSERT INTO user_access_level (user_id, access_level) VALUES (30, 'customer');
INSERT INTO user_access_level (user_id, access_level) VALUES (30, 'waiter_E19');
INSERT INTO user_access_level (user_id, access_level) VALUES (31, 'customer');
INSERT INTO user_access_level (user_id, access_level) VALUES (31, 'waiter_E20');
INSERT INTO user_access_level (user_id, access_level) VALUES (32, 'customer');
INSERT INTO user_access_level (user_id, access_level) VALUES (32, 'waiter_E19');
INSERT INTO user_access_level (user_id, access_level) VALUES (33, 'customer');
INSERT INTO user_access_level (user_id, access_level) VALUES (33, 'waiter_E10');
INSERT INTO user_access_level (user_id, access_level) VALUES (34, 'customer');
INSERT INTO user_access_level (user_id, access_level) VALUES (34, 'waiter_E14');


INSERT INTO reservation (person_id, date_time_reserved, arriving_time, exit_time, customers_nbr, additional_info, is_cancelled, table_id, establishment_id) VALUES (1, '2020-10-12 20:30:00.000000', null, null, 4, null, false, 1, 1);
INSERT INTO reservation (person_id, date_time_reserved, arriving_time, exit_time, customers_nbr, additional_info, is_cancelled, table_id, establishment_id) VALUES (2, '2020-11-15 19:30:00.000000', null, null, 6, null, false, 4, 2);
INSERT INTO reservation (person_id, date_time_reserved, arriving_time, exit_time, customers_nbr, additional_info, is_cancelled, table_id, establishment_id) VALUES (2, '2020-05-26 21:30:00.000000', null, null, 2, null, false, 3, 2);
INSERT INTO reservation (person_id, date_time_reserved, arriving_time, exit_time, customers_nbr, additional_info, is_cancelled, table_id, establishment_id) VALUES (1, '2020-12-19 18:45:00.000000', null, null, 4, null, false, 1, 1);
INSERT INTO reservation (person_id, date_time_reserved, arriving_time, exit_time, customers_nbr, additional_info, is_cancelled, table_id, establishment_id) VALUES (2, '2020-12-19 19:45:00.000000', null, null, 6, null, false, 2, 1);
INSERT INTO reservation (person_id, date_time_reserved, arriving_time, exit_time, customers_nbr, additional_info, is_cancelled, table_id, establishment_id) VALUES (5, '2020-12-21 18:00:00.000000', null, null, 6, 'Près d''une fenêtre', false, 2, 1);
INSERT INTO reservation (person_id, date_time_reserved, arriving_time, exit_time, customers_nbr, additional_info, is_cancelled, table_id, establishment_id) VALUES (7, '2020-12-23 17:45:00.000000', null, null, 4, null, null, 1, 1);
INSERT INTO reservation (person_id, date_time_reserved, arriving_time, exit_time, customers_nbr, additional_info, is_cancelled, table_id, establishment_id) VALUES (9, '2020-12-23 19:30:00.000000', null, null, 4, 'A une table calme', false, 2, 1);
INSERT INTO reservation (person_id, date_time_reserved, arriving_time, exit_time, customers_nbr, additional_info, is_cancelled, table_id, establishment_id) VALUES (11, '2021-01-03 18:30:00.000000', null, null, 3, null, false, 2, 1);
INSERT INTO reservation (person_id, date_time_reserved, arriving_time, exit_time, customers_nbr, additional_info, is_cancelled, table_id, establishment_id) VALUES (12, '2020-12-30 19:30:00.000000', null, null, 2, null, false, 1, 1);
INSERT INTO reservation (person_id, date_time_reserved, arriving_time, exit_time, customers_nbr, additional_info, is_cancelled, table_id, establishment_id) VALUES (12, '2020-12-28 11:54:00.000000', null, null, 2, null, false, 2, 1);
INSERT INTO reservation (person_id, date_time_reserved, arriving_time, exit_time, customers_nbr, additional_info, is_cancelled, table_id, establishment_id) VALUES (14, '2020-12-31 19:45:00.000000', null, null, 1, null, false, 2, 1);
INSERT INTO reservation (person_id, date_time_reserved, arriving_time, exit_time, customers_nbr, additional_info, is_cancelled, table_id, establishment_id) VALUES (15, '2021-01-15 17:30:00.000000', null, null, 2, 'Près de la fenêtre', false, 2, 1);
INSERT INTO reservation (person_id, date_time_reserved, arriving_time, exit_time, customers_nbr, additional_info, is_cancelled, table_id, establishment_id) VALUES (16, '2021-01-15 11:55:00.000000', null, null, 4, null, false, 1, 1);
INSERT INTO reservation (person_id, date_time_reserved, arriving_time, exit_time, customers_nbr, additional_info, is_cancelled, table_id, establishment_id) VALUES (18, '2021-01-16 20:45:00.000000', null, null, 2, null, false, 1, 1);
INSERT INTO reservation (person_id, date_time_reserved, arriving_time, exit_time, customers_nbr, additional_info, is_cancelled, table_id, establishment_id) VALUES (20, '2021-01-16 16:56:00.000000', null, null, 4, null, false, 2, 1);
INSERT INTO reservation (person_id, date_time_reserved, arriving_time, exit_time, customers_nbr, additional_info, is_cancelled, table_id, establishment_id) VALUES (34, '2021-01-19 18:51:00.000000', null, null, 4, null, false, 14, 4);
INSERT INTO reservation (person_id, date_time_reserved, arriving_time, exit_time, customers_nbr, additional_info, is_cancelled, table_id, establishment_id) VALUES (25, '2021-01-18 20:30:00.000000', null, null, 1, null, false, 14, 4);
INSERT INTO reservation (person_id, date_time_reserved, arriving_time, exit_time, customers_nbr, additional_info, is_cancelled, table_id, establishment_id) VALUES (30, '2020-12-22 19:51:00.000000', '13:54:00', '13:54:00', 4, null, false, 14, 4);
INSERT INTO reservation (person_id, date_time_reserved, arriving_time, exit_time, customers_nbr, additional_info, is_cancelled, table_id, establishment_id) VALUES (24, '2021-01-20 18:30:00.000000', null, null, 4, null, true, 14, 4);


INSERT INTO public.address (street, number, country, locality_city, postal_code) VALUES ('rue des Pommes', '3', 'Belgique ', 'Naninne', '5100');
INSERT INTO public.person (username, password, last_name, first_name, birth_date, gender, phone_number, email, is_positive_to_covid_19, address_id) VALUES ('nyssa', '$2b$10$E8R1tXRUr2t2l80pUq/og.nHaj6VHGjXDK9GROcMHYue5m6DVc/rm', 'Bodart', 'Aurélie', '1996-05-10', 'F', '0497390431', 'bodartaurelie2008@hotmail.com', false, 55);

INSERT INTO reservation (person_id, date_time_reserved, arriving_time, exit_time, customers_nbr, additional_info, is_cancelled, table_id, establishment_id) VALUES (35, '2021-01-26 19:15:00.000000', null, null, 4, 'près de la fenêtre', true, 1, 1);
INSERT INTO reservation (person_id, date_time_reserved, arriving_time, exit_time, customers_nbr, additional_info, is_cancelled, table_id, establishment_id) VALUES (35, '2021-10-05 20:30:00.000000', null, null, 2, null, false, 14, 4);
INSERT INTO reservation (person_id, date_time_reserved, arriving_time, exit_time, customers_nbr, additional_info, is_cancelled, table_id, establishment_id) VALUES (35, '2021-01-06 18:45:00.000000', null, null, 6, 'une chaise enfant supplémentaire', false, 10, 3);
INSERT INTO reservation (person_id, date_time_reserved, arriving_time, exit_time, customers_nbr, additional_info, is_cancelled, table_id, establishment_id) VALUES (35, '2021-01-07 13:00:00.000000', null, null, 4, null, true, 3, 2);
INSERT INTO reservation (person_id, date_time_reserved, arriving_time, exit_time, customers_nbr, additional_info, is_cancelled, table_id, establishment_id) VALUES (35, '2021-05-10 13:00:00.000000', null, null, 4, null, true, 88, 12);
INSERT INTO reservation (person_id, date_time_reserved, arriving_time, exit_time, customers_nbr, additional_info, is_cancelled, table_id, establishment_id) VALUES (35, '2021-12-13 20:30:00.000000', null, null, 2, null, false, 90, 13);
INSERT INTO reservation (person_id, date_time_reserved, arriving_time, exit_time, customers_nbr, additional_info, is_cancelled, table_id, establishment_id) VALUES (35, '2021-06-15 18:30:00.000000', null, null, 4, null, false, 81, 10);
INSERT INTO reservation (person_id, date_time_reserved, arriving_time, exit_time, customers_nbr, additional_info, is_cancelled, table_id, establishment_id) VALUES (35, '2021-09-23 19:00:00.000000', null, null, 6, null, false, 61, 8);


INSERT INTO locality (city, postal_code) VALUES ('Sabadell', '08205');
INSERT INTO public.address (street, number, country, locality_city, postal_code) VALUES ('Carrer de Saturn', '6', 'Espagne ', 'Sabadell', '08205');
INSERT INTO public.person (username, password, last_name, first_name, birth_date, gender, phone_number, email, is_positive_to_covid_19, address_id) VALUES ('mrlechocobo', '$2b$10$tfbmrsFs5doUiTV7M.UMSuoHXducI1DR2aPCgrIwcUNE/47GZnCA6', 'Lemaire', 'Jonas', '1996-10-28', 'M', '0498395635', 'lemaire.jonas@hotmail.fr', false, 56);

INSERT INTO reservation (person_id, date_time_reserved, arriving_time, exit_time, customers_nbr, additional_info, is_cancelled, table_id, establishment_id) VALUES (36, '2021-01-26 19:15:00.000000', null, null, 4, 'une place pour une chaise roulante', false,2, 1);
INSERT INTO reservation (person_id, date_time_reserved, arriving_time, exit_time, customers_nbr, additional_info, is_cancelled, table_id, establishment_id) VALUES (36, '2021-10-05 20:30:00.000000', null, null, 2, null, false, 15, 4);
INSERT INTO reservation (person_id, date_time_reserved, arriving_time, exit_time, customers_nbr, additional_info, is_cancelled, table_id, establishment_id) VALUES (36, '2021-01-06 18:45:00.000000', null, null, 6, 'une chaise enfant supplémentaire', true, 11, 3);
INSERT INTO reservation (person_id, date_time_reserved, arriving_time, exit_time, customers_nbr, additional_info, is_cancelled, table_id, establishment_id) VALUES (36, '2021-01-07 13:00:00.000000', null, null, 4, null, true, 4, 2);

INSERT INTO public.address (street, number, country, locality_city, postal_code) VALUES ('Rue des Bolettes', '3', 'Belgique ', 'Naninne', '5100');
INSERT INTO public.person (username, password, last_name, first_name, birth_date, gender, phone_number, email, is_positive_to_covid_19, address_id) VALUES ('nicolas', '$2b$10$M5AmokKIc4gKNBbknFW5duM45zoFIJAeYBD1.q8i8VtCKWLBL.Ghe', 'Bodart', 'Nicolas', '2003-02-06', 'M', '0496352156', 'nicolas.bodart@hotmail.be', true, 57);

INSERT INTO reservation (person_id, date_time_reserved, arriving_time, exit_time, customers_nbr, additional_info, is_cancelled, table_id, establishment_id) VALUES (37, '2021-01-26 19:15:00.000000', null, null, 4, 'près de la fenêtre', true, 15, 4);
INSERT INTO reservation (person_id, date_time_reserved, arriving_time, exit_time, customers_nbr, additional_info, is_cancelled, table_id, establishment_id) VALUES (37, '2021-12-05 20:30:00.000000', null, null, 2, null, false, 15, 4);
INSERT INTO reservation (person_id, date_time_reserved, arriving_time, exit_time, customers_nbr, additional_info, is_cancelled, table_id, establishment_id) VALUES (37, '2021-02-06 18:45:00.000000', null, null, 6, 'une chaise enfant supplémentaire', true, 11, 3);
INSERT INTO reservation (person_id, date_time_reserved, arriving_time, exit_time, customers_nbr, additional_info, is_cancelled, table_id, establishment_id) VALUES (37, '2021-02-07 13:00:00.000000', null, null, 4, null, true, 4, 2);
