package project.backend.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import project.backend.Repository.TravelPlanRepository;

@Service
public class TravelPlanService
{
    @Autowired
    private TravelPlanRepository travelPlanRepository;


}
