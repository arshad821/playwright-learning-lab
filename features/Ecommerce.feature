Feature: Ecommerce Validations

    Scenario: Placing Order
        Given User should login to the ecommerce site with "arsharahsd977@gmail.com" and "Arshad@7"
        When User adds "Zara Coat 3" to the cart
        Then User should be able to see the "Zara Coat 3" product in the cart
        When user enter valid country code "Ind" and country name "India" and verify "arsharahsd977@gmail.com" and place order
        Then User should verify the order in order history page

Feature: Ecommerce Validations
#typical cucumber feature file with scenario outline and examples
    Scenario Outline: Placing Order
        Given User should login to the ecommerce site with "<UserName>" and "<Password>"
        Then Logged In
    Examples:
        | UserName                  | Password  |
        | arsharahsd977@gmail.com   | Arshad@7  |
