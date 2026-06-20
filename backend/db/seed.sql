-- Seed de exemplo: inserir usuário e países de teste
-- Senha: 123456 (hash bcrypt pré-gerado)
INSERT INTO users (name, username, password_hash)
VALUES (
  'Usuario Teste',
  'admin',
  '$2a$10$1bXCp5K3FqcHBQfYXLQkYOFlEK6J9.L0tPXr.W8VJ6EzI8nQE.qUK'
)
ON CONFLICT (username) DO NOTHING;

-- Países de exemplo (alguns bem conhecidos)
INSERT INTO countries (name, cca3, capital, region, population, area, flag_url)
VALUES
  ('Brazil', 'BRA', 'Brasília', 'Americas', 215000000, 8514877, 'https://flagcdn.com/br.svg'),
  ('United States', 'USA', 'Washington, D.C.', 'Americas', 338289857, 9833520, 'https://flagcdn.com/us.svg'),
  ('Japan', 'JPN', 'Tokyo', 'Asia', 125124989, 377975, 'https://flagcdn.com/jp.svg'),
  ('Germany', 'DEU', 'Berlin', 'Europe', 83369843, 357022, 'https://flagcdn.com/de.svg'),
  ('France', 'FRA', 'Paris', 'Europe', 67970571, 643801, 'https://flagcdn.com/fr.svg'),
  ('India', 'IND', 'New Delhi', 'Asia', 1417173173, 3287263, 'https://flagcdn.com/in.svg'),
  ('Australia', 'AUS', 'Canberra', 'Oceania', 26068792, 7692024, 'https://flagcdn.com/au.svg'),
  ('Canada', 'CAN', 'Ottawa', 'Americas', 39742694, 9984670, 'https://flagcdn.com/ca.svg'),
  ('China', 'CHN', 'Beijing', 'Asia', 1408975000, 9562910, 'https://flagcdn.com/cn.svg'),
  ('Russia', 'RUS', 'Moscow', 'Europe/Asia', 144000000, 17098242, 'https://flagcdn.com/ru.svg'),
  ('United Kingdom', 'GBR', 'London', 'Europe', 67886011, 243610, 'https://flagcdn.com/gb.svg'),
  ('Italy', 'ITA', 'Rome', 'Europe', 58853482, 301340, 'https://flagcdn.com/it.svg'),
  ('Spain', 'ESP', 'Madrid', 'Europe', 48807137, 505990, 'https://flagcdn.com/es.svg'),
  ('Mexico', 'MEX', 'Mexico City', 'Americas', 128649565, 1964375, 'https://flagcdn.com/mx.svg'),
  ('Argentina', 'ARG', 'Buenos Aires', 'Americas', 45696159, 2780400, 'https://flagcdn.com/ar.svg'),
  ('South Africa', 'ZAF', 'Pretoria', 'Africa', 64007187, 1219090, 'https://flagcdn.com/za.svg'),
  ('Egypt', 'EGY', 'Cairo', 'Africa', 116538258, 1001450, 'https://flagcdn.com/eg.svg'),
  ('Saudi Arabia', 'SAU', 'Riyadh', 'Asia', 35300280, 2149690, 'https://flagcdn.com/sa.svg'),
  ('Turkey', 'TUR', 'Ankara', 'Europe/Asia', 85341241, 783562, 'https://flagcdn.com/tr.svg'),
  ('South Korea', 'KOR', 'Seoul', 'Asia', 51751065, 100210, 'https://flagcdn.com/kr.svg'),
  ('North Korea', 'PRK', 'Pyongyang', 'Asia', 26498823, 120540, 'https://flagcdn.com/kp.svg'),
  ('Indonesia', 'IDN', 'Jakarta', 'Asia', 276361783, 1904569, 'https://flagcdn.com/id.svg'),
  ('Pakistan', 'PAK', 'Islamabad', 'Asia', 240485658, 881913, 'https://flagcdn.com/pk.svg'),
  ('Bangladesh', 'BGD', 'Dhaka', 'Asia', 173562364, 147570, 'https://flagcdn.com/bd.svg'),
  ('Nigeria', 'NGA', 'Abuja', 'Africa', 223804632, 923768, 'https://flagcdn.com/ng.svg'),
  ('Kenya', 'KEN', 'Nairobi', 'Africa', 54667987, 580367, 'https://flagcdn.com/ke.svg'),
  ('Ethiopia', 'ETH', 'Addis Ababa', 'Africa', 123379924, 1104300, 'https://flagcdn.com/et.svg'),
  ('Morocco', 'MAR', 'Rabat', 'Africa', 37457924, 446550, 'https://flagcdn.com/ma.svg'),
  ('Algeria', 'DZA', 'Algiers', 'Africa', 46814308, 2381741, 'https://flagcdn.com/dz.svg'),
  ('Chile', 'CHL', 'Santiago', 'Americas', 19764771, 756102, 'https://flagcdn.com/cl.svg'),
  ('Colombia', 'COL', 'Bogotá', 'Americas', 52886363, 1141748, 'https://flagcdn.com/co.svg'),
  ('Peru', 'PER', 'Lima', 'Americas', 34352719, 1285216, 'https://flagcdn.com/pe.svg'),
  ('Venezuela', 'VEN', 'Caracas', 'Americas', 28490453, 916445, 'https://flagcdn.com/ve.svg'),
  ('Ukraine', 'UKR', 'Kyiv', 'Europe', 39400000, 603500, 'https://flagcdn.com/ua.svg'),
  ('Poland', 'POL', 'Warsaw', 'Europe', 37400000, 312696, 'https://flagcdn.com/pl.svg'),
  ('Netherlands', 'NLD', 'Amsterdam', 'Europe', 17600000, 41543, 'https://flagcdn.com/nl.svg'),
  ('Belgium', 'BEL', 'Brussels', 'Europe', 11876844, 30689, 'https://flagcdn.com/be.svg'),
  ('Sweden', 'SWE', 'Stockholm', 'Europe', 10500000, 450295, 'https://flagcdn.com/se.svg'),
  ('Norway', 'NOR', 'Oslo', 'Europe', 5400000, 385207, 'https://flagcdn.com/no.svg'),
  ('Switzerland', 'CHE', 'Bern', 'Europe', 8900000, 41284, 'https://flagcdn.com/ch.svg'),
  ('Austria', 'AUT', 'Vienna', 'Europe', 9178482, 83879, 'https://flagcdn.com/at.svg'),
  ('Greece', 'GRC', 'Athens', 'Europe', 10400000, 131957, 'https://flagcdn.com/gr.svg')
ON CONFLICT (cca3) DO NOTHING;

