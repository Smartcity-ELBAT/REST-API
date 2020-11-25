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
    id int generated always as identity primary key,
    establishment_id int not null,
    seats_nbr int not null,
    is_outside bool not null,
    foreign key (establishment_id) references establishment(id),
    check (seats_nbr >= 1 and seats_nbr <= 8)
);

create table reservation (
    person_id int,
    date_time_reserved timestamp,
    arriving_time time,
    exit_time time,
    customers_nbr int not null,
    additional_info text,
    is_cancelled bool,
    table_id int not null,
    establishment_id int not null,
    foreign key (person_id) references person(id),
    primary key (person_id, date_time_reserved),
    foreign key (table_id) references "table" (id),
    foreign key (establishment_id) references establishment(id),
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

insert into locality(city, postal_code) values ('fruitCity', '5100');
insert into locality(city, postal_code) values ('PommeTown', '5300');

insert into address (street, number, country, locality_city, postal_code)
values ('rue des pommes', 5, 'Belgique', 'fruitCity', '5100');

insert into address (street, number, country, locality_city, postal_code)
VALUES ('rue des cerises', 10, 'Belgique', 'PommeTown', '5300');

insert into access_level (access_level) VALUES ('customer');
