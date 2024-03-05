import { getPool } from "../db/getPool";

export async function getP21Addresses() {
  const db = await getPool();
  const p21Addresses = (await db
    .request()
    .query(
      `
      select cast(c.id as varchar) as id, 
      c.name,
      c.phys_address1,
      c.phys_city,
      c.phys_state,
      c.phys_postal_code,
      cast(a.customer_id as varchar) as customer_id,
      d.placekey as p21_placekey,
      RIGHT(placekey,11) as p21_placekeyWhere
	  ,e.salesrep_id
	  ,f.first_name + ' ' + f.last_name as 'salesrep_name'
      from
      customer a
      left join ship_to b on a.customer_id = b.customer_id
      left join address c on b.ship_to_id = c.id
      left join address_ud d on c.id = d.id 
      left join customer_salesrep e on a.customer_id = e.customer_id and e.primary_salesrep_flag = 'Y' and e.row_status_flag = 704
	  left join contacts f on e.salesrep_id = f.id
      where a.delete_flag <> 'Y' and
      a.customer_name not like '%DNU%'
      and a.customer_name not like '%DNS%'
      and d.placekey is not null

      UNION ALL

      select 'P' + cast(a.prospect_uid as varchar) as id
      ,a.name as name
      ,a.address as phys_address1
      ,a.city as phys_city
      ,a.state as phys_state
      ,a.zip as phys_postal_code
      ,'P' + Cast(a.prospect_uid AS varchar) as customer_id
      ,a.sg_placekey as p21_placekey
      ,RIGHT(sg_placekey,11) as p21_placekeyWhere
      ,a.assigned_salesrep_id
      ,b.first_name + ' ' + b.last_name as 'salesrep_name'
      from mwd_crm_prospects a
      left join contacts b on a.assigned_salesrep_id = b.id
      where (a.invalid_prospect is null or a.invalid_prospect = 'N')
      and a.sg_placekey is not null
      and a.address_id is null

    `
    )
    .then((result) => {
      return result.recordset;
    })) as P21Adress[];
  console.log("p21_addresse count", p21Addresses.length);

  return p21Addresses;
}

export type P21Adress = {
  id: string;
  name: string;
  phys_address1: string;
  phys_city: string;
  phys_state: string;
  phys_postal_code: string;
  customer_id: string;
  p21_placekey: string;
  p21_placekeyWhere: string;
  salesrep_id: string;
  salesrep_name: string;
};
