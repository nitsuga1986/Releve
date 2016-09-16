class LandingController < ApplicationController
  def index
	@landingpage=true
	@preloadQuote = ["La buena condición física es el primer requisito para la felicidad","Roma no fue construida en una hora. Por lo que paciencia y persistencia son cualidades imprescindibles en el logro de cualquier esfuerzo que merezca la pena","El desarrollo de los músculos profundos ayuda naturalmente al desarrollo de los músculos más grandes, de la misma manera que pequeños ladrillos construyen grandes edificios","La verdadera flexibilidad sólo puede conseguirse cuando la musculatura está uniformemente desarrollada","Eres tan joven o tan viejo como te sientes. Si tu espalda es rígida con 30 años, entonces eres viejo. Si consigues que sea móvil y flexible a los 60, entonces te seguirás manteniendo joven","Sería un grave error pensar que sólo hacer ejercicio es suficiente para lograr el completo bienestar físico. La persona que cuide su alimentación y hábitos de sueño y que se ejercite correctamente estará tomando la mejor medicina preventiva","La correcta alineación y postura sólo será posible cuando el mecanismo completo de funcionamiento del cuerpo esté bajo control","Cada uno somos arquitectos de nuestra propia vida. Y la felicidad está subordinada al bienestar físico por encima del nivel social o el estatus económico","La primera lección es aprender a respirar correctamente. Para mejorar la respiración del individuo, es insuficiente decirle simplemente inspira y exhala. Sólo cuando se entiende el funcionamiento de la correcta respiración puede transmitirse adecuadamente","La respiración es la primera acción que realizamos en la vida, y la última. Una respiración vaga e incompleta te acerca a la enfermedad","Los hábitos incorrectos en el día a día son los responsables de la mayoría de las dolencias","En su condición normal, el niño no necesita el estímulo artificial del ejercicio. Es el hecho de vivir en un contexto artificial lo que supone que haya que guiarle en busca del control consciente de su cuerpo para a partir de ahí transformarlo en hábitos para convertirlos en rutinas inconscientes","Existen determinados comportamientos que no sólo condicionan sino que perjudican el correcto desarrollo del niño como: Ponerles de pie o hacerles que caminen cuando su estructura osteoarticular no está preparada para ello; Sentarlos en sillas cuando posiblemente estarían más cómodos en el suelo; Impedirles trepar o salvar obstáculos, cuando su inclinación natural es afrontar esos retos"].sample
  end
  
  def confirmation
	@show_errors = true
	@preloadQuote = ["La buena condición física es el primer requisito para la felicidad","Roma no fue construida en una hora. Por lo que paciencia y persistencia son cualidades imprescindibles en el logro de cualquier esfuerzo que merezca la pena","El desarrollo de los músculos profundos ayuda naturalmente al desarrollo de los músculos más grandes, de la misma manera que pequeños ladrillos construyen grandes edificios","La verdadera flexibilidad sólo puede conseguirse cuando la musculatura está uniformemente desarrollada","Eres tan joven o tan viejo como te sientes. Si tu espalda es rígida con 30 años, entonces eres viejo. Si consigues que sea móvil y flexible a los 60, entonces te seguirás manteniendo joven","Sería un grave error pensar que sólo hacer ejercicio es suficiente para lograr el completo bienestar físico. La persona que cuide su alimentación y hábitos de sueño y que se ejercite correctamente estará tomando la mejor medicina preventiva","La correcta alineación y postura sólo será posible cuando el mecanismo completo de funcionamiento del cuerpo esté bajo control","Cada uno somos arquitectos de nuestra propia vida. Y la felicidad está subordinada al bienestar físico por encima del nivel social o el estatus económico","La primera lección es aprender a respirar correctamente. Para mejorar la respiración del individuo, es insuficiente decirle simplemente inspira y exhala. Sólo cuando se entiende el funcionamiento de la correcta respiración puede transmitirse adecuadamente","La respiración es la primera acción que realizamos en la vida, y la última. Una respiración vaga e incompleta te acerca a la enfermedad","Los hábitos incorrectos en el día a día son los responsables de la mayoría de las dolencias","En su condición normal, el niño no necesita el estímulo artificial del ejercicio. Es el hecho de vivir en un contexto artificial lo que supone que haya que guiarle en busca del control consciente de su cuerpo para a partir de ahí transformarlo en hábitos para convertirlos en rutinas inconscientes","Existen determinados comportamientos que no sólo condicionan sino que perjudican el correcto desarrollo del niño como: Ponerles de pie o hacerles que caminen cuando su estructura osteoarticular no está preparada para ello; Sentarlos en sillas cuando posiblemente estarían más cómodos en el suelo; Impedirles trepar o salvar obstáculos, cuando su inclinación natural es afrontar esos retos"].sample
  end
  
end


