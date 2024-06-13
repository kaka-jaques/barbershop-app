package br.com.kjf.barbershop.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.kjf.barbershop.vo.UserVO;

public interface UserRepository extends JpaRepository<UserVO, Integer>{

}
