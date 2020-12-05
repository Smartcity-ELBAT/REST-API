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
    foreign key (establishment_id) references establishment(id),
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
    foreign key (table_id, establishment_id) references "table" (id, establishment_id),
    check (customers_nbr >= 1 and customers_nbr <= 8)
);

create table access_level (
    access_level text primary key,
    establishment_id int,
    foreign key (establishment_id) references establishment(id),
    check (access_level.access_level similar to 'admin|waiter%|customer')
);

create table user_access_level (
    user_id int,
    access_level text,
    foreign key (user_id) references person(id),
    foreign key (access_level) references access_level(access_level),
    primary key (user_id, access_level)
);

insert into locality(city, postal_code) values ('Naninne', '5100');
insert into locality(city, postal_code) values ('Wépion', '5100');

insert into address (street, number, country, locality_city, postal_code)
values ('rue des pommes', 5, 'Belgique', 'Naninne', '5100');

insert into address (street, number, country, locality_city, postal_code)
VALUES ('rue des cerises', 10, 'Belgique', 'Wépion', '5100');

insert into address (street, number, country, locality_city, postal_code)
VALUES ('rue des bananes', 15, 'Belgique', 'Wépion', '5100');

insert into address (street, number, country, locality_city, postal_code)
VALUES ('rue des poires', 20, 'Belgique', 'Wépion', '5100');

insert into person (username, password, last_name, first_name, birth_date, gender, phone_number, email, is_positive_to_covid_19, address_id)
VALUES ('pomme123', '$2b$10$GTjeVpITeh6K.Oh8oGq5NOn/Ywvd5Hnruc6HUCyfeCQF2hP6EdIW.', 'Fruit', 'Pomme', '2015-05-10', 'f', '1234567890', 'pomme@fruit.be', null, '1' );

insert into person (username, password, last_name, first_name, birth_date, gender, phone_number, email, is_positive_to_covid_19, address_id)
VALUES ('poire123', '$2b$10$5fixCge7j6I2BLSGlQ7eV.YGrKLaK.nsdglpZ4Hg3P2etvqUUCAvK', 'Fruit', 'Poire', '2013-08-18', 'm', '0147852369', 'poire@fruit.be', null, '4' );

insert into person (username, password, last_name, first_name, birth_date, gender, phone_number, email, is_positive_to_covid_19, address_id)
VALUES ('kiwi123', '$2b$10$7APucUJHm93.lIZYGuv.EegpIXWRu9VXKH4PfEwWzOXEScQCbiDfy', 'Fruit', 'Kiwi', '2010-05-20', 'm', '0147852396', 'kiwi@fruit.be', null, '2' );

insert into establishment (name, phone_number, vat_number, email, category, address_id)
VALUES ('Sams Lunch', '9876543210', 'BE9874563210', 'samslunch@restau.be', 'sandwicherie', 1);

insert into establishment (name, phone_number, vat_number, email, category, address_id)
VALUES ('Yayami', '0123456789', 'BE3692580147', 'yayami@restau.be', 'asiatique', 3);

insert into "table" (establishment_id, seats_nbr, is_outside)
VALUES (1, 4, true);

insert into "table" (establishment_id, seats_nbr, is_outside)
VALUES (1, 6, false);

insert into "table" (establishment_id, seats_nbr, is_outside)
VALUES (2, 4, true);

insert into "table" (establishment_id, seats_nbr, is_outside)
VALUES (2, 6, false);

insert into "table" (establishment_id, seats_nbr, is_outside)
VALUES (2, 6, false);

insert into access_level(access_level) values ( 'customer' );
insert into access_level(access_level) values ( 'admin' );
insert into access_level(access_level, establishment_id) values ( 'waiter_E1',  1);

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