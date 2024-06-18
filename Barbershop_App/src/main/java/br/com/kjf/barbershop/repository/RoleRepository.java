package br.com.kjf.barbershop.repository;

import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import br.com.kjf.barbershop.vo.RoleVO;

public interface RoleRepository extends JpaRepository<RoleVO, Integer> {

	@Query("FROM RoleVO WHERE name = :name")
	public RoleVO findByName(@Param("name") String name);
	
	@Query("FROM RoleVO WHERE id = :id")
	public RoleVO findById(@Param("id")int id);
	
}
