import pool from "../config/database.js";

export const findByName = async (name) => {
  const [rows] = await pool.execute("SELECT * FROM profiles WHERE name = ?", [
    name.toLowerCase(),
  ]);
  return rows[0];
};

export const findById = async (id) => {
  const [rows] = await pool.execute("SELECT * FROM profiles WHERE id = ?", [
    id,
  ]);
  return rows[0];
};

export const save = (p) =>
  pool.execute(
    `INSERT INTO profiles (
      id, name, gender, gender_probability, sample_size, age,
      age_group, country_id, country_probability, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
    [
      p.id,
      p.name,
      p.gender,
      p.gender_probability,
      p.sample_size,
      p.age,
      p.age_group,
      p.country_id,
      p.country_probability,
    ],
  );

export const findAll = async (filters) => {
  let sql = "SELECT id, name, gender, age, age_group, country_id FROM profiles";
  const clauses = [];
  const params = [];

  for (const [key, column] of [
    ["gender", "LOWER(gender) = LOWER(?)"],
    ["country_id", "country_id = ?"],
    ["age_group", "age_group = ?"],
  ]) {
    if (filters[key]) {
      clauses.push(column);
      params.push(filters[key]);
    }
  }

  if (clauses.length) sql += ` WHERE ${clauses.join(" AND ")}`;

  const [rows] = await pool.execute(sql, params);
  return rows;
};

export const deleteById = async (id) => {
  const [result] = await pool.execute("DELETE FROM profiles WHERE id = ?", [
    id,
  ]);
  return result.affectedRows > 0;
};
