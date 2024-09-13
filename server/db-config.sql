-- not currently tested until I can set up a virtual machine
create database if not exists iot_dashboard;
use iot_dashboard;

create table if not exists users (
    `user_id` mediumint primary key auto_increment,
    `password_hash` binary(16) not null
);

create table if not exists airlines (
    `airline_id` mediumint primary key auto_increment,
    `name` varchar(50),
    `icon_filename` char(20)
);

create table if not exists fleets (
    `fleet_id` mediumint primary key auto_increment,
    `name` varchar(50),
    `icon_filename` char(20),
    `airline_id` mediumint foreign key references airlines.airline_id
);

create table if not exists planes (
    `plane_id` mediumint primary key auto_increment,
    `name` varchar(50),
    `icon_filename` char(20),
    `fleet_id` mediumint foreign key references airlines.airline_id
);

create table if not exists logs (
    `log_id` mediumint primary key auto_increment,
    `message` text
);
