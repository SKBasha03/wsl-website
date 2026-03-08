import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Input } from "../components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "../components/ui/toggle-group";
import { PlayerCard } from "../components/PlayerCard";
import { Player } from "../context/CartContext";
import {
  getFreeAgentCardImage,
  normalizeNameKey,
  warnOnMissingFreeAgentCardImages,
} from "../lib/freeAgentCardImages";

type PlayerStatusFilter = "available" | "unavailable" | "auction";

type PlayerDataOverride = {
  rating: number;
  club: string;
  price: string;
};

function parsePlayerDataTSV(data: string): Record<string, PlayerDataOverride> {
  const overrides: Record<string, PlayerDataOverride> = {};
  const lines = data.split(/\r?\n/);

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    const partsByTab = line
      .split("\t")
      .map((p) => p.trim())
      .filter(Boolean);
    const parts = partsByTab.length >= 4
      ? partsByTab
      : line.split(/\s{2,}/).map((p) => p.trim()).filter(Boolean);
    if (parts.length < 4) continue;

    const name = parts[0];
    const rating = Number(parts[1]);
    const club = parts[2];
    const price = parts.slice(3).join(" ");

    if (!name || !Number.isFinite(rating) || !club || !price) continue;
    overrides[normalizeNameKey(name)] = { rating, club, price };
  }

  return overrides;
}

const ovrOverrides: Record<string, number> = {
  "cristiano ronaldo": 86,
  "karim benzema": 86,
  "lautaro martinez": 89,
  "marcus thuram": 83,
  "aleksandar mitrovic": 82,
  "randal kolo muani": 82,
  "mauro icardi": 83,
  "luuk de jong": 81,
  "goncalo ramos": 79,
  "iago aspas": 84,
  "ayoze perez": 79,
  "joao pedro": 77,
  "raul jimenez": 74,
  "dominic solanke": 81,
  "ollie watkins": 85,
  "ivan toney": 80,
  "jarrod bowen": 82,
  "matheus cunha": 79,
  "ousmane dembele": 86,
  "hugo ekitike": 76,
  "ciro immobile": 82,
  "pierre emerick aubameyang": 82,
  "sunil chhetri": 66,
  "darwin nunez": 82,
  "diogo jota": 85,
  "cody gakpo": 83,
  "Victor Osimhen": 87, 
  "lionel messi": 88,
  "riyad mahrez": 85,
  "marco asensio": 81,
  "dusan tadic": 83,
  "takefusa kubo": 81,
  "hirving lozano": 78,
  "ismaila sarr": 76,
  "antoine semenyo": 76,
  "bryan mbeumo": 80,
  "viktor tsygankov": 83,
  "christian pulisic": 83,
  "moussa diaby": 83,
  "mohamed salah": 89,
  "neymar jr": 87,
  "rafael leao": 86,
  "sadio mane": 84,
  "kaoru mitoma": 81,
  "kerem akturkoglu": 77,
  "steven bergwijn": 79,
  "yannick carrasco": 83,
  "yoane wissa": 79,
  "mohammed kudus": 82,
  "mikel oyarzabal": 82,
  "bradley barcola": 80,
  "baris alper yilmaz": 80,
  "julian quinones": 78,
  "luis diaz": 84,
  "theo hernandez": 87,
  "jose gaya": 82,
  "pervis estupinan": 80,
  "milos kerkez": 77,
  "rayan ait nouri": 79,
  "federico dimarco": 84,
  "nuno mendes": 83,
  "ferdi kadioglu": 81,
  "andrew robertson": 85,
  "achraf hakimi": 84,
  "daniel munoz": 80,
  "trent alexander arnold": 86,
  "virgil van dijk": 89,
  "marquinhos": 87,
  "alessandro bastoni": 87,
  "kalidou koulibaly": 84,
  "milan skriniar": 81,
  "stefan de vrij": 83,
  "lewis dunk": 79,
  "marc guehi": 81,
  "igor zubeldia": 80,
  "francesco acerbi": 84,
  "benjamin pavard": 84,
  "fikayo tomori": 83,
  "jean clair todibo": 80,
  "dante": 79,
  "presnel kimpembe": 81,
  "willian pacho": 78,
  "david hancko": 81,
  "roger ibanez": 80,
  "aymeric laporte": 83,
  "ibrahima konate": 83,
  "joe gomez": 80,
  "denzel dumfries": 82,

  "gianluigi donnarumma": 89,
  "mike maignan": 87,
  "yassine bounou": 84,
  "bernd leno": 82,
  "jose sa": 79,
  "emiliano martinez": 87,
  "alex remiro": 84,
  "kevin trapp": 82,
  "alisson becker": 89,

  "nicolo barella": 87,
  "sergej milinkovic savic": 85,
  "hakan calhanoglu": 86,
  "vitinha": 85,
  "otavio": 82,
  "joao neves": 79,
  "piotr zielinski": 81,
  "jordan henderson": 80,
  "james ward prowse": 79,
  "davide frattesi": 81,
  "carlos soler": 78,
  "renato sanches": 79,
  "nico gonzalez": 81,
  "fabian ruiz": 82,
  "ismael bennacer": 83,
  "manuel ugarte": 81,
  "mario gotze": 80,
  "fred": 81,
  "lucas torreira": 83,
  "franck kessie": 82,
  "n golo kante": 85,
  "marcelo brozovic": 82,
  "ruben neves": 84,
  "fabinho": 82,
  "edson alvarez": 81,
  "william carvalho": 80,
  "martin zubimendi": 81,
  "tijjani reijnders": 82,
  "alexis mac allister": 86,
  "dominik szoboszlai": 81,
  "ryan gravenberch": 78,
  "mikel merino": 85,
  "ruben loftus cheek": 81,
  "Khvicha Kvaratskhelia": 85,
  "rafa silva": 83,
  "roberto firmino": 80,
  "malcom": 82,
  "lucas paqueta": 82,
  "andreas pereira": 78,
  "henrikh mkhitaryan": 83,
  "anderson talisca": 82,
  "youri tielemans": 81,
};

// Format: Name<TAB>OVR<TAB>Club<TAB>Price
const PLAYER_DATA_TSV = `
Cristiano Ronaldo	86	Al-Nassr	€690,000
Karim Benzema	86	Al-Ittihad	€690,000
Lautaro Martínez	89	Inter	€750,000
Marcus Thuram	83	Inter	€650,000
Aleksandar Mitrović	82	Al-Hilal	€610,000
Randal Kolo Muani	82	PSG	€610,000
Mauro Icardi	83	Galatasaray	€650,000
Luuk de Jong	81	PSV	€610,000
Gonçalo Ramos	79	PSG	€570,000
Iago Aspas	84	Celta Vigo	€650,000
João Pedro	77	Brighton	€530,000
Raúl Jiménez	74	Fulham	€450,000
Dominic Solanke	81	Bournemouth	€610,000
Ollie Watkins	85	Aston Villa	€690,000
Ivan Toney	80	Brentford	€570,000
Jarrod Bowen	82	West Ham	€610,000
Matheus Cunha	79	Wolves	€570,000
Ousmane Dembélé	86	PSG	€690,000
Hugo Ekitike	76	Frankfurt	€490,000
Ciro Immobile	82	Besiktas	€610,000
Pierre-Emerick Aubameyang	82	Al-Qadisiyah	€610,000
Sunil Chhetri	66	India	€300,000
Darwin Núñez	82	Liverpool	€610,000
Diogo Jota	85	Liverpool	€690,000
Cody Gakpo	83	Liverpool	€650,000
Lionel Messi	88	Inter Miami	€720,000
Riyad Mahrez	85	Al-Ahli	€690,000
Marco Asensio	81	PSG	€610,000
Dušan Tadić	83	Fenerbahçe	€650,000
Takefusa Kubo	81	Real Sociedad	€610,000
Hirving Lozano	78	PSV	€530,000
Ismaila Sarr	76	Crystal Palace	€490,000
Antoine Semenyo	76	Bournemouth	€490,000
Bryan Mbeumo	80	Brentford	€570,000
Viktor Tsygankov	83	Girona	€650,000
Christian Pulisic	83	Milan	€650,000
Moussa Diaby	83	Al-Ittihad	€650,000
Mohamed Salah	89	Liverpool	€750,000
Leon Bailey	82	Aston Villa	€610,000
Jonathan Clauss	80	Nice	€570,000
Achraf Hakimi	84	PSG	€650,000
Daniel Muñoz	80	Crystal Palace	€570,000
Trent Alexander-Arnold	86	Liverpool	€690,000
Neymar Jr	87	Al-Hilal	€720,000
Rafael Leão	86	Milan	€690,000
Sadio Mané	84	Al-Nassr	€650,000
Kaoru Mitoma	81	Brighton	€610,000
Kerem Aktürkoğlu	77	Galatasaray	€530,000
Steven Bergwijn	79	Ajax	€570,000
Yannick Carrasco	83	Al-Shabab	€650,000
Yoane Wissa	79	Brentford	€570,000
Mohammed Kudus	82	West Ham	€610,000
Mikel Oyarzabal	82	Real Sociedad	€610,000
Bradley Barcola	80	PSG	€570,000
Barış Yılmaz	80	Galatasaray	€570,000
Julián Quiñones	78	Al-Qadisiyah	€530,000
Luis Díaz	84	Liverpool	€650,000
Luis Sinisterra	77	Bournemouth	€530,000
Morgan Rogers	75	Aston Villa	€490,000
Salem Al-Dawsari	80	Al-Hilal	€570,000
Theo Hernández	87	Milan	€720,000
José Gayà	82	Valencia	€610,000
Pervis Estupiñán	80	Brighton	€570,000
Milos Kerkez	77	Bournemouth	€530,000
Rayan Aït-Nouri	79	Wolves	€570,000
Federico Dimarco	84	Inter	€650,000
Nuno Mendes	83	PSG	€650,000
Ferdi Kadıoğlu	81	Fenerbahçe	€610,000
Andrew Robertson	85	Liverpool	€690,000
Gianluigi Donnarumma	89	PSG	€750,000
Mike Maignan	87	Milan	€720,000
Yassine Bounou	84	Al-Hilal	€650,000
Bernd Leno	82	Fulham	€610,000
José Sá	79	Wolves	€570,000
Emiliano Martínez	87	Aston Villa	€720,000
Álex Remiro	84	Real Sociedad	€650,000
Kevin Trapp	82	Frankfurt	€610,000
Alisson Becker	89	Liverpool	€750,000
Nicolò Barella	87	Inter	€720,000
Sergej Milinković-Savić	85	Al-Hilal	€690,000
Hakan Çalhanoğlu	86	Inter	€690,000
Vitinha	85	PSG	€690,000
Otávio	82	Al-Nassr	€610,000
João Neves	79	PSG	€570,000
Piotr Zieliński	81	Inter	€610,000
Jordan Henderson	80	Ajax	€570,000
James Ward-Prowse	79	West Ham	€570,000
Davide Frattesi	81	Inter	€610,000
Carlos Soler	78	PSG	€530,000
Renato Sanches	79	PSG	€570,000
Fabián Ruiz	82	PSG	€610,000
Ismaël Bennacer	83	Milan	€650,000
Manuel Ugarte	81	PSG	€610,000
Mario Götze	80	Frankfurt	€570,000
Fred	81	Fenerbahçe	€610,000
Lucas Torreira	83	Galatasaray	€650,000
Franck Kessié	82	Al-Ahli	€610,000
N'Golo Kanté	85	Al-Ittihad	€690,000
Marcelo Brozović	82	Al-Nassr	€610,000
Alexis Mac Allister	86	Liverpool	€690,000
Dominik Szoboszlai	81	Liverpool	€610,000
Ryan Gravenberch	78	Liverpool	€530,000
Rúben Neves	84	Al-Hilal	€650,000
Fabinho	82	Al-Ittihad	€610,000
Edson Álvarez	81	West Ham	€610,000
William Carvalho	80	Real Betis	€570,000
Martin Zubimendi	81	Real Sociedad	€610,000
Tijjani Reijnders	82	Milan	€610,000
Marquinhos	87	PSG	€720,000
Alessandro Bastoni	87	Inter	€720,000
Kalidou Koulibaly	84	Al-Hilal	€650,000
Milan Škriniar	81	PSG	€610,000
Stefan de Vrij	83	Inter	€650,000
Lewis Dunk	79	Brighton	€570,000
Marc Guehi	81	Crystal Palace	€610,000
Igor Zubeldia	80	Real Sociedad	€570,000
Francesco Acerbi	84	Inter	€650,000
Benjamin Pavard	84	Inter	€650,000
Fikayo Tomori	83	Milan	€650,000
Jean-Clair Todibo	80	Nice	€570,000
Dante	79	Nice	€570,000
Presnel Kimpembe	81	PSG	€610,000
William Pacho	78	Frankfurt	€530,000
David Hancko	81	Feyenoord	€610,000
Roger Ibañez	80	Al-Ahli	€570,000
Aymeric Laporte	83	Al-Nassr	€650,000
Virgil van Dijk	89	Liverpool	€750,000
Ibrahima Konaté	83	Liverpool	€650,000
Joe Gomez	80	Liverpool	€570,000
Henrikh Mkhitaryan	83	Inter	€650,000
Anderson Talisca	82	Al-Nassr	€610,000
Lucas Paquetá	82	West Ham	€610,000
Andreas Pereira	78	Fulham	€530,000
Youri Tielemans	81	Aston Villa	€610,000
Mikel Merino	85	Real Sociedad	€690,000
Ruben Loftus-Cheek	81	Milan	€610,000
Rafa Silva	83	Besiktas	€650,000
Roberto Firmino	80	Al-Ahli	€570,000
Malcom	82	Al-Hilal	€610,000
Denzel Dumfries	82	Inter	€610,000
Victor Osimhen 87 GalatasarayFC €650,000
Khvicha Kvaratskhelia 85 PSG €750,000
`;

const playerDataOverrides = parsePlayerDataTSV(PLAYER_DATA_TSV);

const SOLD_OUT_PLAYER_IDS = new Set<string>([
  "def1",
  "fwd1",
  "def3",
  "mid1",
  "def15",
  "def32",
  "mid13",  
  "gk2",
  "fwd4",
  "fwd40",
  "mid22",
  "mid41",
  "fwd3",
  "def23",
  "fwd27",
  "mid27",
  "mid35",
  "fwd54",
  "def26",
  "mid19",
  "fwd41",
  "def31",
  "def12",
  "def13",
  "mid4",
  "def28",
  "mid30",
  "fwd2",
  "gk7",
  "def10",
  "fwd19",
  "gk3",
  "def22",
  "mid3",
  "def17",
  "def14",
  "mid10",
  "def19",
  "def2",
  "fwd38",
  "mid6",
  "mid40",
  "fwd39",
  "def34",
  "def33",
  "fwd50",
  "fwd42",
  "fwd37",
  "gk1",
  "fwd48",
  "def4",
  "def29",
  "fwd15",
  "mid2",
  "mid24",
  "fwd53",
  "def11",
]);

const IN_AUCTION_PLAYER_IDS = new Set<string>([
  
]);

const mockPlayers: Player[] = [
  // Goalkeepers
  
  { id: "gk1", name: "Alisson Becker", position: "Goalkeeper", rating: 90, image: "https://images.unsplash.com/photo-1677119966332-8c6e9fb0efab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBnb2Fsa2VlcGVyJTIwYWN0aW9ufGVufDF8fHx8MTc3MjYxNDg0M3ww&ixlib=rb-4.1.0&q=80&w=1080", nationality: "Brazil", club: "Free Agent", price: "€15,000,000" },
  { id: "gk2", name: "Gianluigi Donnarumma", position: "Goalkeeper", rating: 88, image: "https://images.unsplash.com/photo-1677119966332-8c6e9fb0efab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBnb2Fsa2VlcGVyJTIwYWN0aW9ufGVufDF8fHx8MTc3MjYxNDg0M3ww&ixlib=rb-4.1.0&q=80&w=1080", nationality: "Italy", club: "Free Agent", price: "€14,000,000" },
  { id: "gk3", name: "Mike Maignan", position: "Goalkeeper", rating: 87, image: "https://images.unsplash.com/photo-1677119966332-8c6e9fb0efab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBnb2Fsa2VlcGVyJTIwYWN0aW9ufGVufDF8fHx8MTc3MjYxNDg0M3ww&ixlib=rb-4.1.0&q=80&w=1080", nationality: "France", club: "Free Agent", price: "€12,500,000" },
  { id: "gk4", name: "Yassine Bounou", position: "Goalkeeper", rating: 84, image: "https://images.unsplash.com/photo-1677119966332-8c6e9fb0efab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBnb2Fsa2VlcGVyJTIwYWN0aW9ufGVufDF8fHx8MTc3MjYxNDg0M3ww&ixlib=rb-4.1.0&q=80&w=1080", nationality: "Morocco", club: "Free Agent", price: "€9,500,000" },
  { id: "gk5", name: "Bernd Leno", position: "Goalkeeper", rating: 83, image: "https://images.unsplash.com/photo-1677119966332-8c6e9fb0efab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBnb2Fsa2VlcGVyJTIwYWN0aW9ufGVufDF8fHx8MTc3MjYxNDg0M3ww&ixlib=rb-4.1.0&q=80&w=1080", nationality: "Germany", club: "Free Agent", price: "€10,000,000" },
  { id: "gk6", name: "José Sá", position: "Goalkeeper", rating: 82, image: "https://images.unsplash.com/photo-1677119966332-8c6e9fb0efab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBnb2Fsa2VlcGVyJTIwYWN0aW9ufGVufDF8fHx8MTc3MjYxNDg0M3ww&ixlib=rb-4.1.0&q=80&w=1080", nationality: "Portugal", club: "Free Agent", price: "€8,500,000" },
  { id: "gk7", name: "Emiliano Martínez", position: "Goalkeeper", rating: 85, image: "https://images.unsplash.com/photo-1677119966332-8c6e9fb0efab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBnb2Fsa2VlcGVyJTIwYWN0aW9ufGVufDF8fHx8MTc3MjYxNDg0M3ww&ixlib=rb-4.1.0&q=80&w=1080", nationality: "Argentina", club: "Free Agent", price: "€11,000,000" },
  { id: "gk8", name: "Álex Remiro", position: "Goalkeeper", rating: 83, image: "https://images.unsplash.com/photo-1677119966332-8c6e9fb0efab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBnb2Fsa2VlcGVyJTIwYWN0aW9ufGVufDF8fHx8MTc3MjYxNDg0M3ww&ixlib=rb-4.1.0&q=80&w=1080", nationality: "Spain", club: "Free Agent", price: "€9,000,000" },
  { id: "gk9", name: "Kevin Trapp", position: "Goalkeeper", rating: 82, image: "https://images.unsplash.com/photo-1677119966332-8c6e9fb0efab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBnb2Fsa2VlcGVyJTIwYWN0aW9ufGVufDF8fHx8MTc3MjYxNDg0M3ww&ixlib=rb-4.1.0&q=80&w=1080", nationality: "Germany", club: "Free Agent", price: "€8,000,000" },
  
  // Defenders

  { id: "def1", name: "Achraf Hakimi", position: "Defender", rating: 80, image: "https://images.unsplash.com/photo-1721506931381-3ba300ad71f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "def2", name: "Daniel Muñoz", position: "Defender", rating: 80, image: "https://images.unsplash.com/photo-1721506931381-3ba300ad71f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "def3", name: "Trent Alexander-Arnold", position: "Defender", rating: 80, image: "https://images.unsplash.com/photo-1721506931381-3ba300ad71f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "def4", name: "Theo Hernández", position: "Defender", rating: 80, image: "https://images.unsplash.com/photo-1721506931381-3ba300ad71f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "def5", name: "José Gayà", position: "Defender", rating: 80, image: "https://images.unsplash.com/photo-1721506931381-3ba300ad71f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "def6", name: "Pervis Estupiñán", position: "Defender", rating: 80, image: "https://images.unsplash.com/photo-1721506931381-3ba300ad71f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "def7", name: "Milos Kerkez", position: "Defender", rating: 80, image: "https://images.unsplash.com/photo-1721506931381-3ba300ad71f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "def8", name: "Rayan Aït-Nouri", position: "Defender", rating: 80, image: "https://images.unsplash.com/photo-1721506931381-3ba300ad71f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "def9", name: "Federico Dimarco", position: "Defender", rating: 80, image: "https://images.unsplash.com/photo-1721506931381-3ba300ad71f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "def10", name: "Nuno Mendes", position: "Defender", rating: 80, image: "https://images.unsplash.com/photo-1721506931381-3ba300ad71f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "def11", name: "Ferdi Kadıoğlu", position: "Defender", rating: 80, image: "https://images.unsplash.com/photo-1721506931381-3ba300ad71f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "def12", name: "Andrew Robertson", position: "Defender", rating: 80, image: "https://images.unsplash.com/photo-1721506931381-3ba300ad71f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "def13", name: "Marquinhos", position: "Defender", rating: 80, image: "https://images.unsplash.com/photo-1721506931381-3ba300ad71f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "def14", name: "Alessandro Bastoni", position: "Defender", rating: 80, image: "https://images.unsplash.com/photo-1721506931381-3ba300ad71f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "def15", name: "Kalidou Koulibaly", position: "Defender", rating: 80, image: "https://images.unsplash.com/photo-1721506931381-3ba300ad71f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "def16", name: "Milan Škriniar", position: "Defender", rating: 80, image: "https://images.unsplash.com/photo-1721506931381-3ba300ad71f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "def17", name: "Stefan de Vrij", position: "Defender", rating: 80, image: "https://images.unsplash.com/photo-1721506931381-3ba300ad71f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "def18", name: "Lewis Dunk", position: "Defender", rating: 80, image: "https://images.unsplash.com/photo-1721506931381-3ba300ad71f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "def19", name: "Marc Guehi", position: "Defender", rating: 80, image: "https://images.unsplash.com/photo-1721506931381-3ba300ad71f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "def20", name: "Igor Zubeldia", position: "Defender", rating: 80, image: "https://images.unsplash.com/photo-1721506931381-3ba300ad71f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "def21", name: "Francesco Acerbi", position: "Defender", rating: 80, image: "https://images.unsplash.com/photo-1721506931381-3ba300ad71f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "def22", name: "Benjamin Pavard", position: "Defender", rating: 80, image: "https://images.unsplash.com/photo-1721506931381-3ba300ad71f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "def23", name: "Fikayo Tomori", position: "Defender", rating: 80, image: "https://images.unsplash.com/photo-1721506931381-3ba300ad71f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "def24", name: "Jean-Clair Todibo", position: "Defender", rating: 80, image: "https://images.unsplash.com/photo-1721506931381-3ba300ad71f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "def25", name: "Dante", position: "Defender", rating: 80, image: "https://images.unsplash.com/photo-1721506931381-3ba300ad71f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "def26", name: "Presnel Kimpembe", position: "Defender", rating: 80, image: "https://images.unsplash.com/photo-1721506931381-3ba300ad71f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "def27", name: "William Pacho", position: "Defender", rating: 80, image: "https://images.unsplash.com/photo-1721506931381-3ba300ad71f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "def28", name: "David Hancko", position: "Defender", rating: 80, image: "https://images.unsplash.com/photo-1721506931381-3ba300ad71f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "def29", name: "Roger Ibañez", position: "Defender", rating: 80, image: "https://images.unsplash.com/photo-1721506931381-3ba300ad71f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "def30", name: "Aymeric Laporte", position: "Defender", rating: 80, image: "https://images.unsplash.com/photo-1721506931381-3ba300ad71f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "def31", name: "Virgil van Dijk", position: "Defender", rating: 80, image: "https://images.unsplash.com/photo-1721506931381-3ba300ad71f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "def32", name: "Ibrahima Konaté", position: "Defender", rating: 80, image: "https://images.unsplash.com/photo-1721506931381-3ba300ad71f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "def33", name: "Joe Gomez", position: "Defender", rating: 80, image: "https://images.unsplash.com/photo-1721506931381-3ba300ad71f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "def34", name: "Denzel Dumfries", position: "Defender", rating: 80, image: "https://images.unsplash.com/photo-1721506931381-3ba300ad71f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },

  // Midfielders

  { id: "mid1", name: "Nicolò Barella", position: "Midfielder", rating: 87, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "mid2", name: "Sergej Milinković-Savić", position: "Midfielder", rating: 85, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "mid3", name: "Hakan Çalhanoğlu", position: "Midfielder", rating: 86, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "mid4", name: "Vitinha", position: "Midfielder", rating: 85, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "mid5", name: "Otávio", position: "Midfielder", rating: 82, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "mid6", name: "João Neves", position: "Midfielder", rating: 79, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "mid7", name: "Piotr Zieliński", position: "Midfielder", rating: 81, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "mid8", name: "Jordan Henderson", position: "Midfielder", rating: 80, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "mid9", name: "James Ward-Prowse", position: "Midfielder", rating: 79, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "mid10", name: "Davide Frattesi", position: "Midfielder", rating: 81, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "mid11", name: "Carlos Soler", position: "Midfielder", rating: 78, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "mid12", name: "Renato Sanches", position: "Midfielder", rating: 79, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "mid13", name: "Fabián Ruiz", position: "Midfielder", rating: 82, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "mid14", name: "Ismaël Bennacer", position: "Midfielder", rating: 83, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "mid15", name: "Manuel Ugarte", position: "Midfielder", rating: 81, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "mid16", name: "Mario Götze", position: "Midfielder", rating: 80, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "mid17", name: "Fred", position: "Midfielder", rating: 81, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "mid18", name: "Lucas Torreira", position: "Midfielder", rating: 83, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "mid19", name: "Franck Kessié", position: "Midfielder", rating: 82, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "mid20", name: "N'Golo Kanté", position: "Midfielder", rating: 85, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "mid21", name: "Marcelo Brozović", position: "Midfielder", rating: 82, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "mid22", name: "Alexis Mac Allister", position: "Midfielder", rating: 86, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "mid23", name: "Dominik Szoboszlai", position: "Midfielder", rating: 81, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "mid24", name: "Ryan Gravenberch", position: "Midfielder", rating: 78, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "mid25", name: "Rúben Neves", position: "Midfielder", rating: 84, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "mid26", name: "Fabinho", position: "Midfielder", rating: 82, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "mid27", name: "Edson Álvarez", position: "Midfielder", rating: 81, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "mid28", name: "William Carvalho", position: "Midfielder", rating: 80, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "mid29", name: "Martin Zubimendi", position: "Midfielder", rating: 81, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "mid30", name: "Tijjani Reijnders", position: "Midfielder", rating: 82, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "mid31", name: "Henrikh Mkhitaryan", position: "Midfielder", rating: 83, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "mid32", name: "Anderson Talisca", position: "Midfielder", rating: 82, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "mid33", name: "Lucas Paquetá", position: "Midfielder", rating: 82, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "mid34", name: "Andreas Pereira", position: "Midfielder", rating: 78, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "mid35", name: "Youri Tielemans", position: "Midfielder", rating: 81, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "mid36", name: "Mikel Merino", position: "Midfielder", rating: 85, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "mid37", name: "Ruben Loftus-Cheek", position: "Midfielder", rating: 81, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "mid38", name: "Rafa Silva", position: "Midfielder", rating: 83, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "mid39", name: "Roberto Firmino", position: "Midfielder", rating: 80, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "mid40", name: "Malcom", position: "Midfielder", rating: 82, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "mid41", name: "Khvicha Kvaratskhelia", position: "Midfielder", rating: 85, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€750,000" },

  // Forwards

  { id: "fwd1", name: "Cristiano Ronaldo", position: "Forward", rating: 80, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "fwd2", name: "Karim Benzema", position: "Forward", rating: 80, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "fwd3", name: "Lautaro Martínez", position: "Forward", rating: 80, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "fwd4", name: "Marcus Thuram", position: "Forward", rating: 80, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "fwd5", name: "Aleksandar Mitrović", position: "Forward", rating: 80, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "fwd6", name: "Randal Kolo Muani", position: "Forward", rating: 80, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "fwd7", name: "Mauro Icardi", position: "Forward", rating: 80, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "fwd8", name: "Luuk de Jong", position: "Forward", rating: 80, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "fwd9", name: "Gonçalo Ramos", position: "Forward", rating: 80, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "fwd10", name: "Iago Aspas", position: "Forward", rating: 80, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "fwd12", name: "João Pedro", position: "Forward", rating: 80, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "fwd13", name: "Raúl Jiménez", position: "Forward", rating: 80, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "fwd14", name: "Dominic Solanke", position: "Forward", rating: 80, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "fwd15", name: "Ollie Watkins", position: "Forward", rating: 80, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "fwd16", name: "Ivan Toney", position: "Forward", rating: 80, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "fwd17", name: "Jarrod Bowen", position: "Forward", rating: 80, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "fwd18", name: "Matheus Cunha", position: "Forward", rating: 80, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "fwd19", name: "Ousmane Dembélé", position: "Forward", rating: 80, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "fwd20", name: "Hugo Ekitike", position: "Forward", rating: 80, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "fwd21", name: "Ciro Immobile", position: "Forward", rating: 80, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "fwd22", name: "Pierre-Emerick Aubameyang", position: "Forward", rating: 80, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "fwd23", name: "Sunil Chhetri", position: "Forward", rating: 80, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "fwd24", name: "Darwin Núñez", position: "Forward", rating: 80, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "fwd25", name: "Diogo Jota", position: "Forward", rating: 80, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "fwd26", name: "Cody Gakpo", position: "Forward", rating: 80, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "fwd27", name: "Lionel Messi", position: "Forward", rating: 80, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "fwd28", name: "Riyad Mahrez", position: "Forward", rating: 80, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "fwd29", name: "Marco Asensio", position: "Forward", rating: 80, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "fwd30", name: "Dušan Tadić", position: "Forward", rating: 80, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "fwd31", name: "Takefusa Kubo", position: "Forward", rating: 80, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "fwd32", name: "Hirving Lozano", position: "Forward", rating: 80, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "fwd33", name: "Ismaila Sarr", position: "Forward", rating: 80, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "fwd34", name: "Antoine Semenyo", position: "Forward", rating: 80, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "fwd35", name: "Bryan Mbeumo", position: "Forward", rating: 80, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "fwd36", name: "Viktor Tsygankov", position: "Forward", rating: 80, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "fwd37", name: "Christian Pulisic", position: "Forward", rating: 80, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "fwd38", name: "Moussa Diaby", position: "Forward", rating: 80, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "fwd39", name: "Mohamed Salah", position: "Forward", rating: 80, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "fwd40", name: "Neymar Jr", position: "Forward", rating: 80, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "fwd41", name: "Rafael Leão", position: "Forward", rating: 80, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "fwd42", name: "Sadio Mané", position: "Forward", rating: 80, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "fwd43", name: "Kaoru Mitoma", position: "Forward", rating: 80, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "fwd44", name: "Kerem Aktürkoğlu", position: "Forward", rating: 80, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "fwd45", name: "Steven Bergwijn", position: "Forward", rating: 80, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "fwd46", name: "Yannick Carrasco", position: "Forward", rating: 80, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "fwd47", name: "Yoane Wissa", position: "Forward", rating: 80, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "fwd48", name: "Mohammed Kudus", position: "Forward", rating: 80, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "fwd49", name: "Mikel Oyarzabal", position: "Forward", rating: 80, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "fwd50", name: "Bradley Barcola", position: "Forward", rating: 80, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "fwd51", name: "Barış Yılmaz", position: "Forward", rating: 80, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "fwd52", name: "Julián Quiñones", position: "Forward", rating: 80, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "fwd53", name: "Luis Díaz", position: "Forward", rating: 80, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€10,000,000" },
  { id: "fwd54", name: "Victor Osimhen", position: "Forward", rating: 87, image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", nationality: "Unknown", club: "Free Agent", price: "€650,000" },

].map((player) => ({
  ...player,
  club: playerDataOverrides[normalizeNameKey(player.name)]?.club ?? player.club,
  image: getFreeAgentCardImage(player.name) ?? player.image,
  price:
    playerDataOverrides[normalizeNameKey(player.name)]?.price ?? player.price,
  rating:
    playerDataOverrides[normalizeNameKey(player.name)]?.rating ??
    ovrOverrides[normalizeNameKey(player.name)] ??
    player.rating,
  soldOut: SOLD_OUT_PLAYER_IDS.has(player.id),
  inAuction: IN_AUCTION_PLAYER_IDS.has(player.id),
}));

warnOnMissingFreeAgentCardImages(mockPlayers.map((p) => p.name));

export function FreeAgents() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<PlayerStatusFilter>("available");

  const statusIndex: Record<PlayerStatusFilter, number> = {
    available: 0,
    unavailable: 1,
    auction: 2,
  };

  const totalPlayers = mockPlayers.length;
  const totalGoalkeepers = mockPlayers.filter((p) => p.position === "Goalkeeper").length;
  const totalDefenders = mockPlayers.filter((p) => p.position === "Defender").length;
  const totalMidfielders = mockPlayers.filter((p) => p.position === "Midfielder").length;
  const totalForwards = mockPlayers.filter((p) => p.position === "Forward").length;

  const filterByStatus = (players: Player[]) => {
    switch (statusFilter) {
      case "available":
        return players.filter((p) => !p.soldOut && !p.inAuction);
      case "unavailable":
        return players.filter((p) => Boolean(p.soldOut));
      case "auction":
        return players.filter((p) => Boolean(p.inAuction));
      default:
        return players;
    }
  };

  const filterPlayers = (position: string) => {
    const normalizedQuery = normalizeNameKey(searchQuery);
    const byPosition =
      position === "all" ? mockPlayers : mockPlayers.filter((p) => p.position === position);

    const byStatus = filterByStatus(byPosition);

    if (!normalizedQuery) return byStatus;

    return byStatus.filter((p) =>
      normalizeNameKey(`${p.name} ${p.club} ${p.nationality}`).includes(normalizedQuery)
    );
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Free Agents Market</h1>
        <p className="text-gray-400">Browse and add players to your squad</p>

        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-gray-300">
            Total Players: <span className="font-semibold text-white">{totalPlayers}</span>
          </div>
          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-gray-300">
            Goalkeepers: <span className="font-semibold text-white">{totalGoalkeepers}</span>
          </div>
          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-gray-300">
            Defenders: <span className="font-semibold text-white">{totalDefenders}</span>
          </div>
          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-gray-300">
            Midfielders: <span className="font-semibold text-white">{totalMidfielders}</span>
          </div>
          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-gray-300">
            Forwards: <span className="font-semibold text-white">{totalForwards}</span>
          </div>
        </div>

        <div className="mt-6 max-w-md">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search free agents..."
            aria-label="Search free agents"
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
          />
        </div>
      </div>

      {/* Position Tabs & Status Filter */}
      <Tabs defaultValue="all" className="space-y-8" onValueChange={setActiveTab}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Position Tabs */}
          <div className="flex justify-center lg:justify-start">
            <TabsList className="bg-white/5 border border-white/10 p-1 rounded-lg">
              <TabsTrigger 
                value="all" 
                className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-gray-400 font-semibold px-4 rounded-md transition-all duration-200"
              >
                All Players
              </TabsTrigger>
              <TabsTrigger 
                value="Goalkeeper" 
                className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-gray-400 font-semibold px-4 rounded-md transition-all duration-200"
              >
                Goalkeepers
              </TabsTrigger>
              <TabsTrigger 
                value="Defender" 
                className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-gray-400 font-semibold px-4 rounded-md transition-all duration-200"
              >
                Defenders
              </TabsTrigger>
              <TabsTrigger 
                value="Midfielder" 
                className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-gray-400 font-semibold px-4 rounded-md transition-all duration-200"
              >
                Midfielders
              </TabsTrigger>
              <TabsTrigger 
                value="Forward" 
                className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-gray-400 font-semibold px-4 rounded-md transition-all duration-200"
              >
                Forwards
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Status Filter */}
          <div className="flex items-center justify-center lg:justify-end gap-4">
            <div className="text-sm text-gray-400 font-semibold uppercase tracking-wide">Status</div>
            <ToggleGroup
              type="single"
              value={statusFilter}
              onValueChange={(value) => {
                if (!value) return;
                setStatusFilter(value as PlayerStatusFilter);
              }}
              className="relative grid w-full max-w-md grid-cols-3 items-stretch rounded-full border border-white/10 bg-white/5 p-1 sm:w-[420px]"
            >
              <div
                aria-hidden="true"
                className="absolute inset-y-1 left-1 rounded-full bg-white/20 transition-transform duration-300 ease-out"
                style={{
                  width: "calc((100% - 0.5rem) / 3)",
                  transform: `translateX(${statusIndex[statusFilter] * 100}%)`,
                }}
              />
              <ToggleGroupItem
                value="available"
                className="relative z-10 rounded-full bg-transparent text-gray-300 font-semibold transition-colors duration-200 hover:text-white data-[state=on]:bg-transparent data-[state=on]:text-white"
              >
                Available
              </ToggleGroupItem>
              <ToggleGroupItem
                value="unavailable"
                className="relative z-10 rounded-full bg-transparent text-gray-300 font-semibold transition-colors duration-200 hover:text-white data-[state=on]:bg-transparent data-[state=on]:text-white"
              >
                Unavailable
              </ToggleGroupItem>
              <ToggleGroupItem
                value="auction"
                className="relative z-10 rounded-full bg-transparent text-gray-300 font-semibold transition-colors duration-200 hover:text-white data-[state=on]:bg-transparent data-[state=on]:text-white"
              >
                In Auction
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filterPlayers("all").map(player => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="Goalkeeper" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filterPlayers("Goalkeeper").map(player => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="Defender" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filterPlayers("Defender").map(player => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="Midfielder" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filterPlayers("Midfielder").map(player => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="Forward" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filterPlayers("Forward").map(player => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}