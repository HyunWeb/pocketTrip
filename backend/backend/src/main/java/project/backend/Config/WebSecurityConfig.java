package project.backend.Config;

import io.netty.handler.ssl.SslContext;
import io.netty.handler.ssl.SslContextBuilder;
import io.netty.handler.ssl.util.InsecureTrustManagerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.CsrfConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.reactive.function.client.WebClient;
import project.backend.Security.JwtAuthenticationFilter;
import reactor.netty.http.client.HttpClient;

import javax.net.ssl.SSLException;
import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

    @Value("${released.URL}")
    String url;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JwtAuthenticationFilter jwtAuthenticationFilter) throws Exception {
        http.cors(Customizer.withDefaults())
                .csrf(CsrfConfigurer::disable)
                .sessionManagement(
                        sessionManager -> sessionManager.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize.requestMatchers("/","/auth/**", "/rate/**","/ws/**", "/api/**","/public/**").permitAll().anyRequest().authenticated());
        //로그인, 환율, 소켓만 비로그인 시 접속 가능 나머지는 jwt 토큰 필요
        http.addFilterBefore(jwtAuthenticationFilter, CorsFilter.class);

        return http.build();
    }

    // cors 설정 정의
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowCredentials(true);
        config.setAllowedOriginPatterns(Arrays.asList("http://localhost:3000", "http://localhost:9000", "http://13.124.212.22:3000", "http://13.124.212.22:81"));  // 특정 도메인 허용
        config.setAllowedMethods(Arrays.asList("HEAD", "POST", "GET", "DELETE", "PUT", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));  // 🔹 허용할 헤더 추가
        config.setExposedHeaders(Arrays.asList("Authorization", "Content-Type")); // 🔹 클라이언트에서 접근 가능하도록 노출

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }


}