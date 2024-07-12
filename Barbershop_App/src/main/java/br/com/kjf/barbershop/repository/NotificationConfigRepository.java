package br.com.kjf.barbershop.repository;

import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import br.com.kjf.barbershop.vo.NotificationConfigVO;
import br.com.kjf.barbershop.vo.UserVO;

public interface NotificationConfigRepository extends JpaRepository<NotificationConfigVO, Integer> {

	@Query("FROM NotificationConfigVO WHERE user_id = :id")
	public NotificationConfigVO getConfigByUser(@Param("id")UserVO user);
	
}
